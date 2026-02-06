# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **DO NOT** open a public GitHub issue for security vulnerabilities
2. Email us at: security@nogeass.com (placeholder - update with actual contact)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- We will acknowledge receipt within 48 hours
- We will provide an initial assessment within 7 days
- We will work with you to understand and resolve the issue
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using this plugin:

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Keep dependencies updated** - Run `npm audit` regularly
3. **Use environment variables** - Never hardcode secrets in source code
4. **Review `.gitignore`** - Ensure sensitive files are excluded

## Known Security Considerations

- The `install_id` is stored locally in `.local/install_id`
- API keys are passed via environment variables
- All API communication should use HTTPS
