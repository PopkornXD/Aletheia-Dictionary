<div>
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last updated: 11/06-2026</p>

    <section>
        <h2>1. Overview</h2>
        <p>
            This privacy policy explains how I collect, use, and protect your personal information 
            when you utilize the Aletheia Dictionary website.
        </p>
    </section>

    <section>
        <h2>2. Information Collected</h2>
        <p>
            I collect no information about you, unless you manually input data yourself. This can include:
        </p>
        <ul>
            <li>Username</li>
            <li>Email</li>
            <li>Securely hashed password</li>
            <li>Time of account creation</li>
            <li>Project names & time of creation</li>
            <li>Page names</li>
            <li>Page content</li>
            <li>Page relationships</li>
        </ul>
    </section>

    <section>
        <h2>3. How Your Data Is Stored</h2>
        <h3>3.1 Database</h3>
        <p>
            All data is stored in a MariaDB database running in a Docker container on a virtual machine hosted externally by Oracle Cloud. 
            The database is not accessible publicly and can only be interacted with by me and the hosting service.
        </p>

        <h3>3.2 Data Persistence</h3>
        <p>
            Database data is persisted using Docker volumes, ensuring your information is retained 
            across container restarts and updates.
        </p>

        <h3>3.3 Password Security</h3>
        <p>
            Passwords are never stored in plain text. They are encrypted using bcrypt hashing with multiple salt rounds, 
            making it computationally infeasible to reverse-engineer your password from the stored hash.
        </p>
    </section>

    <section>
        <h2>4. How Your Information Is Used</h2>
        <p>Your information is solely used for:</p>
        <ul>
            <li>Authenticating your login sessions</li>
            <li>Storing and displaying your projects and pages</li>
            <li>Assigning permissions to your account</li>
        </ul>
    </section>

    <section>
        <h2>5. Data Access</h2>
        <h3>5.1 Public Information</h3>
        <p>
            No content you create is shared with the public unless you choose to share it yourself.
        </p>

        <h3>5.2 Private Information</h3>
        <p>
            Your password hash and session information are never publicly exposed and are only 
            accessible to the server application for authentication purposes.
        </p>
    </section>

    <section>
        <h2>6. Data Retention</h2>
        <p>
            Your account information, projects, and pages is being retained indefinitely unless you request 
            account deletion. You may contact me to request removal of your account and associated 
            data.
        </p>
    </section>

    <section>
        <h2>7. Third-Party Services</h2>
        <p>
            <strong>Cloudflare Tunnel:</strong> The website uses Cloudflare's tunneling service to provide 
            secure access to the application. Traffic passes through Cloudflare's network, which 
            may be subject to Cloudflare's own privacy policy. Cloudflare does not have access to 
            your unencrypted passwords or session data.
        </p>

        <p>
            <strong>Oracle Cloud:</strong> The website is located on a virtual machine hosted by Oracle Cloud.
            They do not have access to any of your unencrypted passwords or session data, and the security of your data generally
            is protected by Oracle Cloud's own network security.
        </p>
    </section>

    <section>
        <h2>8. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
            <li>Access your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and associated data</li>
            <li>Export your created projects and pages</li>
        </ul>
    </section>

    <section>
        <h2>9. Changes to This Policy</h2>
        <p>
            I may update this privacy policy if the need arises. The "Last updated" date at the 
            top of this page indicates when the policy was last updated. Continued use of the 
            service after changes constitutes acceptance of the updated policy.
        </p>
    </section>

    <section>
        <h2>10. Contact</h2>
        <p>
            If you have questions or would like to contact me for data removal, please do so at: 
            <a href="mailto:iver.espolin.johnson@gmail.com">iver.espolin.johnson@gmail.com</a>
        </p>
    </section>
</div>

<style>

    div {
        width: 800px;
        margin: auto;
        padding: 20px;
    }

    h1 {
        margin-bottom: 0.5rem;
        font-size: 2.5rem;
    }

    .last-updated {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
    }

    section {
        margin-bottom: 2.5rem;
    }

    h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        font-size: 1.75rem;
    }

    h3 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        font-size: 1.25rem;
    }

    p {
        line-height: 1.7;
        margin-bottom: 1rem;
    }

    ul {
        line-height: 1.7;
        margin-left: 2rem;
        margin-bottom: 1rem;
    }

    li {
        margin-bottom: 0.5rem;
    }

    strong {
        font-weight: 600;
    }
</style>
