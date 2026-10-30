<?php
/**
 * THE JEWELRY contact form -> email (Sakura rental server, PHP 8).
 * ----------------------------------------------------------------
 * The site's form (ContactForm.tsx) posts JSON here; this checks it and emails it to
 * CONTACT_TO in config.php as a designed HTML email (with a plain-text version), with Reply-To
 * set to the visitor so a reply goes straight back.
 * Answers JSON: {"success": true} or {"success": false, "message": "..."}.
 *
 * Guards: POST only, this site (or a CONTACT_ORIGINS site, e.g. the GitHub demo) only, hidden "botcheck" field, field length limits,
 * no line breaks in header values, and at most RATE_MAX messages per visitor per RATE_WINDOW.
 */

require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function reply($ok, $message = '', $status = 200) {
    http_response_code($status);
    echo json_encode($ok ? ['success' => true] : ['success' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

// Requests only from this site, or from another site listed in CONTACT_ORIGINS (config.php):
// the browser's Origin (or Referer) must match. The other sites get the CORS headers they need.
$host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''); // without a port
$from = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
$origin = preg_replace('#^(https?://[^/]+).*$#', '$1', $from);
$cross = in_array($origin, defined('CONTACT_ORIGINS') ? CONTACT_ORIGINS : [], true);
if ($cross) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS' && $cross) {
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(false, 'POST only', 405);
}
if (!$cross && ($host === '' || parse_url($from, PHP_URL_HOST) !== $host)) {
    reply(false, 'Forbidden', 403);
}

if (CONTACT_TO === 'PASTE_EMAIL_HERE' || !filter_var(CONTACT_TO, FILTER_VALIDATE_EMAIL)) {
    reply(false, 'Recipient not configured', 500);
}

$raw = file_get_contents('php://input', false, null, 0, 20000);
$in = json_decode((string) $raw, true);
if (!is_array($in)) {
    reply(false, 'Bad request', 400);
}

// Bots fill in the hidden checkbox; pretend it worked.
if (!empty($in['botcheck'])) {
    reply(true);
}

$limits = ['type' => 60, 'company' => 200, 'name' => 100, 'email' => 254, 'tel' => 40, 'date' => 100, 'guests' => 60, 'message' => 5000, 'lang' => 2];
$v = [];
foreach ($limits as $key => $max) {
    $s = trim((string) ($in[$key] ?? ''));
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s); // control characters
    if (mb_strlen($s) > $max) {
        reply(false, 'Too long: ' . $key, 400);
    }
    $v[$key] = $s;
}
// One-line fields must not carry line breaks (they reach the mail headers or subject).
foreach (['type', 'company', 'name', 'email', 'tel', 'date', 'guests'] as $key) {
    $v[$key] = str_replace(["\r", "\n"], ' ', $v[$key]);
}
foreach (['company', 'name', 'email', 'message'] as $key) {
    if ($v[$key] === '') {
        reply(false, 'Missing: ' . $key, 400);
    }
}
if (!filter_var($v['email'], FILTER_VALIDATE_EMAIL)) {
    reply(false, 'Invalid email', 400);
}

// Rate limit per visitor (hashed IP), kept in a small file next to this script.
$ip = $_SERVER['HTTP_X_SAKURA_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? '');
$key = hash('sha256', $ip . '|the-jewelry');
$file = __DIR__ . '/ratelimit.json';
$fh = fopen($file, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $hits = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    $now = time();
    foreach ($hits as $k => $times) {
        $hits[$k] = array_values(array_filter($times, fn($t) => $t > $now - RATE_WINDOW));
        if (!$hits[$k]) unset($hits[$k]);
    }
    if (count($hits[$key] ?? []) >= RATE_MAX) {
        flock($fh, LOCK_UN);
        fclose($fh);
        reply(false, 'Too many messages, please try again later', 429);
    }
    $hits[$key][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    flock($fh, LOCK_UN);
    fclose($fh);
}

$lang = $v['lang'] === 'en' ? '英語' : '日本語';

// Rows of the "お問い合わせ情報" table, in form order; optional fields only when filled in.
$rows = array_filter([
    '会社名・団体名' => $v['company'],
    'お名前'         => $v['name'],
    'メールアドレス' => $v['email'],
    '電話番号'       => $v['tel'],
    'ご希望時期'     => $v['date'],
    '想定人数'       => $v['guests'],
    'サイト言語'     => $lang,
], fn($s) => $s !== '');
$type = $v['type'] !== '' ? $v['type'] : 'その他';

// ---- plain-text version (mail apps that do not show HTML, e.g. Sakura webmail) ----
$text = "THE JEWELRY 公式サイトのお問い合わせフォームより、{$v['company']} 様から新しいお問い合わせがありました。\n"
    . "以下の内容をご確認のうえ、必要に応じてご対応をお願いいたします。\n\n"
    . "■ お問い合わせ種別\n{$type}\n\n■ お問い合わせ情報\n";
foreach ($rows as $label => $value) {
    $text .= "{$label}：{$value}\n";
}
$text .= "\n■ ご相談内容\n{$v['message']}\n\n"
    . "――――――――――――――――――\n"
    . "このメールは THE JEWELRY 公式サイトのお問い合わせフォームから自動送信されています。\n"
    . "このメールに返信すると、お問い合わせいただいた方（{$v['email']}）に届きます。\n";

// ---- HTML version: the design the client asked for. Tables and inline styles only, so it
// renders the same in Gmail, Outlook and phone mail apps. ----
$h = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
$font = "'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic','Meiryo',sans-serif";
$tr = '';
foreach ($rows as $label => $value) {
    $cell = $label === 'メールアドレス'
        ? '<a href="mailto:' . $h($value) . '" style="color:#2a5db0;text-decoration:none;">' . $h($value) . '</a>'
        : $h($value);
    $tr .= '<tr>'
        . '<td valign="top" style="width:36%;padding:14px 12px 14px 0;border-bottom:1px solid #ececec;font-size:12px;color:#777777;">' . $h($label) . '</td>'
        . '<td valign="top" style="padding:12px 0;border-bottom:1px solid #ececec;font-size:15px;color:#1a1a1a;word-break:break-all;">' . $cell . '</td>'
        . '</tr>';
}
$html = '<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' . $h('新しいお問い合わせ') . '</title></head>'
    . '<body style="margin:0;padding:0;background:#f1f1f1;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f1f1;"><tr><td align="center" style="padding:16px 8px;">'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:12px;overflow:hidden;font-family:' . $font . ';">'
    // header
    . '<tr><td align="center" style="background:#1a1a1d;padding:22px 24px 18px;">'
    . '<div style="font-size:13px;font-weight:bold;letter-spacing:.06em;color:#c9b48a;">THE JEWELRY</div>'
    . '<div style="margin-top:6px;font-size:22px;font-weight:bold;color:#ffffff;">新しいお問い合わせ</div>'
    . '<div style="margin-top:6px;font-size:13px;color:#bdbdbd;">公式サイト｜お問い合わせ通知</div>'
    . '</td></tr>'
    // body
    . '<tr><td style="padding:22px 24px 8px;">'
    . '<p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#1a1a1a;">公式サイトのお問い合わせフォームより、<strong>' . $h($v['company']) . ' 様から新しいお問い合わせがありました。</strong></p>'
    . '<p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#666666;">以下の内容をご確認のうえ、必要に応じてご対応をお願いいたします。</p>'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f3eee6;border-radius:8px;"><tr><td style="padding:14px 16px;">'
    . '<div style="font-size:12px;font-weight:bold;color:#8a7354;">お問い合わせ種別</div>'
    . '<div style="margin-top:6px;font-size:18px;font-weight:bold;color:#1a1a1a;">' . $h($type) . '</div>'
    . '</td></tr></table>'
    . '<div style="margin:22px 0 6px;font-size:14px;font-weight:bold;color:#8a7354;">お問い合わせ情報</div>'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' . $tr . '</table>'
    . '<div style="margin:22px 0 8px;font-size:14px;font-weight:bold;color:#8a7354;">ご相談内容</div>'
    . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f6f6;border-radius:8px;"><tr><td style="padding:16px;font-size:15px;line-height:1.8;color:#1a1a1a;word-break:break-word;">' . nl2br($h($v['message'])) . '</td></tr></table>'
    . '</td></tr>'
    // footer
    . '<tr><td style="padding:8px 24px 22px;">'
    . '<div style="border-top:1px solid #e3e3e3;padding-top:16px;font-size:12px;line-height:1.9;color:#777777;">'
    . 'このメールはTHE JEWELRY公式サイトのお問い合わせフォームから自動送信されています。<br>'
    . 'ご返信の際は、お問い合わせいただいた方のメールアドレスをご確認ください。'
    . '</div></td></tr>'
    . '</table></td></tr></table></body></html>';

// ---- send: multipart/alternative, UTF-8, base64 (ISO-2022-JP cannot hold 髙, ①, ㈱ ...) ----
mb_internal_encoding('UTF-8');
$subject = '【THE JEWELRY】お問い合わせ（' . $type . '）' . mb_strimwidth($v['company'], 0, 60, '…') . '様';
$boundary = 'tj-' . bin2hex(random_bytes(12));
$part = fn($mime, $content) => "--{$boundary}\r\n"
    . "Content-Type: {$mime}; charset=UTF-8\r\n"
    . "Content-Transfer-Encoding: base64\r\n\r\n"
    . chunk_split(base64_encode(str_replace("\n", "\r\n", str_replace("\r\n", "\n", $content))));
$message = $part('text/plain', $text) . $part('text/html', $html) . "--{$boundary}--\r\n";
$headers = implode("\r\n", [
    'From: ' . mb_encode_mimeheader(CONTACT_FROM_NAME, 'UTF-8', 'B') . ' <' . CONTACT_FROM . '>',
    'Reply-To: ' . $v['email'],
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
]);

$sent = mail(CONTACT_TO, mb_encode_mimeheader($subject, 'UTF-8', 'B'), $message, $headers, '-f' . CONTACT_FROM);
if (!$sent) {
    error_log('contact.php: mail failed');
    reply(false, 'Mail could not be sent', 500);
}
reply(true);
