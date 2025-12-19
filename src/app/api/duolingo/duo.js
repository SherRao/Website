class CaptchaException extends Error {
    constructor(message) {
        super(message);
        this.name = "CaptchaException";
    }
}

class LoginException extends Error {
    constructor(message) {
        super(message);
        this.name = "LoginException";
    }
}

class NotFoundException extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundException";
    }
}

class UnauthorizedException extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorizedException";
    }
}

/**
 * Simple API client.
 *
 * Notes:
 * - Uses the global fetch API. In Node.js, ensure a fetch polyfill is available (Node 18+ has fetch).
 * - Cookies are sent/received automatically in browser environments when credentials: 'include' is set.
 */
class APIClient {
    /**
     * @param {string} baseUrl
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.userAgent =
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";
        // If you're running in Node and want cookie-jar support, wire it up externally.
    }

    /**
     * Make a request.
     * @param {string} url
     * @param {string|null} token
     * @param {Object|null} data
     * @returns {Promise<Response>}
     */
    async request(url, token = null, data = null) {
        const opts = {
            method: data ? "POST" : "GET",
            headers: {
                "User-Agent": this.userAgent,
                // Only include Authorization header when token is provided; match original behaviour which sent an empty string otherwise.
                ...(token ? { Authorization: `Bearer ${token}` } : { Authorization: "" }),
                "Content-Type": "application/json",
            },
            // For browsers this will include cookies for same-origin requests; for cross-origin you'll need server CORS + credentials.
            credentials: "include",
            body: data ? JSON.stringify(data) : undefined,
        };

        const response = await fetch(url, opts);

        switch (response.status) {
            case 401:
                throw new UnauthorizedException(
                    `You are not authorized to access the resource with URL: '${url}'. Please try again with the correct credentials.`
                );
            case 403: {
                // try to parse JSON and inspect blockScript like original python code
                let bodyJson = null;
                try {
                    bodyJson = await response.clone().json();
                } catch (err) {
                    // non-JSON body: rethrow a generic captcha-like exception
                    throw new CaptchaException(
                        `Request to '${url}' with user agent '${this.userAgent}' was blocked; the API may be requesting a captcha. Please try logging in again with a different user agent.`
                    );
                }
                if (bodyJson && bodyJson.blockScript) {
                    throw new CaptchaException(
                        `Request to '${url}' with user agent '${this.userAgent}' was blocked, and the API requests you to solve a captcha. Please try logging in again with a different user agent.`
                    );
                }
                break;
            }
            case 404:
                throw new NotFoundException("The resource that you are looking for is not found.");
            default:
                break;
        }

        return response;
    }

    /**
     * Log in with username and password.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<string>} JWT token from response headers
     */
    async login(username, password) {
        const url = `${this.baseUrl}/login`;
        const response = await this.request(url, null, { login: username, password: password });

        // Parse JSON to check for "failure" key (mirrors original)
        const json = await response.json().catch(() => ({}));
        if (json && Object.prototype.hasOwnProperty.call(json, "failure")) {
            throw new LoginException(
                "Failed to log in with your current credentials. Please check and try again."
            );
        }

        // Return jwt header if present
        const jwt = response.headers.get("jwt");
        return jwt;
    }

    /**
     * Fetch user data and xp summary.
     * @param {string} username
     * @param {string} token
     * @returns {Promise<[any, any]>} [userResponseData, summaryResponseData]
     */
    async fetchData(username, token) {
        const userUrl = `${this.baseUrl}/users/${encodeURIComponent(username)}`;
        const userResp = await this.request(userUrl, token);
        const userResponseData = await userResp.json();

        const summaryUrl = `${this.baseUrl}/2017-06-30/users/${encodeURIComponent(
            userResponseData.id
        )}/xp_summaries?startDate=1970-01-01`;
        const summaryResp = await this.request(summaryUrl, token);
        const summaryResponseData = await summaryResp.json();

        return [userResponseData, summaryResponseData];
    }
}

// // CommonJS & ES Module compatibility
// if (typeof module !== "undefined" && module.exports) {
//     module.exports = {
//         APIClient,
//         CaptchaException,
//         LoginException,
//         NotFoundException,
//         UnauthorizedException,
//     };
// } else {
//     // eslint-disable-next-line no-undef
//     window.APIClient = APIClient;
//     window.CaptchaException = CaptchaException;
//     window.LoginException = LoginException;
//     window.NotFoundException = NotFoundException;
//     window.UnauthorizedException = UnauthorizedException;
// }

export { APIClient, CaptchaException, LoginException, NotFoundException, UnauthorizedException }