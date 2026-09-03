--name:check_revoked_token
SELECT 1
FROM revoked_tokens
WHERE jti = %s
AND expires_at > CURRENT_TIMESTAMP
LIMIT 1

--name:add_revoked_token
INSERT INTO revoked_tokens (jti, expires_at)
VALUES (%s, %s)
ON CONFLICT (jti) DO NOTHING

--name:remove_expired_tokens
DELETE FROM revoked_tokens
WHERE expires_at <= CURRENT_TIMESTAMP