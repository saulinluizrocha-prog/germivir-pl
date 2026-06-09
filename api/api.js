const crypto = require('crypto');

function phpJsonEncode(obj) {
    let str = JSON.stringify(obj);
    // Escape slashes to match PHP's default json_encode behavior
    str = str.replace(/\//g, '\\/');
    // Escape non-ASCII characters as \uXXXX (lowercase hex, 4 digits)
    str = str.replace(/[\u007f-\uffff]/g, (c) => {
        return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
    return str;
}

module.exports = async (req, res) => {
    // Fallback body parsing if req.body is not automatically parsed (e.g. urlencoded)
    if (!req.body && req.method === 'POST') {
        req.body = await new Promise((resolve) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    const params = new URLSearchParams(body);
                    const parsed = {};
                    for (const [key, value] of params.entries()) {
                        parsed[key] = value;
                    }
                    resolve(parsed);
                } catch (e) {
                    resolve({});
                }
            });
        });
    }

    const name = req.body && req.body.name;
    const phone = req.body && req.body.phone;
    
    if (!name || !phone) {
        const referer = req.headers.referer || '/';
        return res.redirect(302, referer);
    }

    try {
        const config = {
            api_key: 'c66289394c2a6e8515c8e8b382fba719',
            offer_id: '6423',
            user_id: '75329',
            api_domain: 'https://t-api.org',
        };

        const data = {
            name: name.trim(),
            phone: phone.trim(),
            offer_id: config.offer_id,
            country: (req.body.country || 'PL').trim(),
        };

        const extraKeys = [
            'region', 'city', 'count', 'stream_id', 'tz', 'address', 'email', 'zip', 'user_comment', 'referer',
            'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
            'sub_id', 'sub_id_1', 'sub_id_2', 'sub_id_3', 'sub_id_4'
        ];

        for (const key of extraKeys) {
            let value = null;
            if (key === 'stream_id' || key === 'tz') {
                value = '';
            } else if (['region', 'city', 'count', 'address', 'email', 'zip', 'user_comment'].includes(key)) {
                value = req.body[key] !== undefined ? req.body[key] : null;
            } else if (key === 'referer') {
                value = req.query.referer || req.headers.referer || null;
            } else {
                value = req.query[key] !== undefined ? req.query[key] : null;
            }
            data[key] = value;
        }

        const payload = {
            user_id: config.user_id,
            data: data
        };

        const json_data = phpJsonEncode(payload);

        // Checksum calculation: sha1(json_data + api_key)
        const check_sum = crypto
            .createHash('sha1')
            .update(json_data + config.api_key)
            .digest('hex');

        const api_url = `${config.api_domain}/api/lead/create?check_sum=${check_sum}`;

        const apiResponse = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json_data
        });

        if (!apiResponse.ok) {
            throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }

        const responseText = await apiResponse.text();
        let body;
        try {
            body = JSON.parse(responseText);
        } catch (e) {
            throw new Error('JSON response error');
        }

        if (body.status === 'ok') {
            const leadId = body.data && body.data.id;
            return res.redirect(302, `/success.html?id=${leadId}`);
        } else if (body.status === 'error') {
            throw new Error(body.error || 'Unknown API error');
        } else {
            throw new Error('Unknown response status');
        }

    } catch (error) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(500).send(`<h3>Error: ${error.message}</h3>`);
    }
};
