import Layout from '../layouts/Layout';
import Card from '../components/atoms/Card';
import './Documentation.css';

const Documentation = () => {
    return (
        <Layout>
            <div className="docs-container">
                <header className="docs-header mb-xl">
                    <h1 className="text-2xl font-bold">Platform <span className="text-accent">Documentation</span></h1>
                    <p className="text-muted">Operational manual for Cyber Range usage.</p>
                </header>

                <div className="docs-grid">
                    <nav className="docs-sidebar">
                        <ul>
                            <li className="active">Getting Started</li>
                            <li>Lab Interface</li>
                            <li>Connecting (VPN)</li>
                            <li>API Reference</li>
                        </ul>
                    </nav>

                    <div className="docs-content">
                        <Card className="mb-lg">
                            <h2 className="text-xl font-bold mb-md">Getting Started</h2>
                            <p className="text-muted mb-md">
                                Welcome to the Cyber Range. This platform allows you to deploy vulnerable environments on-demand to practice proper security techniques.
                            </p>
                            <h3 className="text-lg font-bold mb-sm text-accent">Prerequisites</h3>
                            <ul className="list-disc pl-lg text-muted">
                                <li>Modern Browser (Chrome/Firefox)</li>
                                <li>Basic knowledge of Linux terminal</li>
                                <li>VPN Client (OpenVPN) if accessing remotely</li>
                            </ul>
                        </Card>

                        <Card className="mb-lg">
                            <h2 className="text-xl font-bold mb-md">Starting a Lab</h2>
                            <p className="text-muted">
                                Navigate to the <strong>Lab Catalog</strong>, select a challenge based on difficulty, and click "Start Lab".
                                The system will provision a Docker container isolated for your session.
                            </p>
                        </Card>

                        <Card className="mb-lg" id="create-lab">
                            <h2 className="text-xl font-bold mb-md">Creating a Custom Lab</h2>
                            <p className="text-muted mb-md">
                                You can contribute to the platform by adding your own vulnerable environments:
                            </p>
                            <ol className="list-decimal pl-lg text-muted mb-md">
                                <li>Navigate to the <strong>Lab Catalog</strong>.</li>
                                <li>Click the <strong>"Create Lab"</strong> button (top right).</li>
                                <li>Fill in the details:
                                    <ul className="list-disc pl-lg mt-sm">
                                        <li><strong>Name & Description</strong>: Describe the vulnerability clearly.</li>
                                        <li><strong>Category</strong>: Choose between Web, Network, Crypto, etc.</li>
                                        <li><strong>Docker Image</strong>: Provide the tag of a public Docker Hub image (e.g. <code>vulnerable/app:latest</code>).</li>
                                    </ul>
                                </li>
                                <li>Set the point value and difficulty.</li>
                                <li>Click "Create" to publish it immediately to the catalog.</li>
                            </ol>
                        </Card>

                        <Card className="mb-lg" id="lab-interface">
                            <h2 className="text-xl font-bold mb-md">Lab Interface</h2>
                            <p className="text-muted mb-md">
                                The Lab Interface is your primary workspace. Once a lab is deployed:
                            </p>
                            <ul className="list-disc pl-lg text-muted mb-md">
                                <li><strong>Status Panel</strong>: Shows the container ID and expiration timer.</li>
                                <li><strong>Terminal Access</strong>: Use the web-based terminal or SSH (see below) to interact with the target.</li>
                                <li><strong>Flag Submission</strong>: Submit the captured flag to validate the challenge.</li>
                            </ul>
                        </Card>

                        <Card className="mb-lg" id="vpn-connection">
                            <h2 className="text-xl font-bold mb-md">Connecting via VPN</h2>
                            <p className="text-muted mb-md">
                                For advanced challenges requiring direct network access:
                            </p>
                            <ol className="list-decimal pl-lg text-muted mb-md">
                                <li>Go to your <strong>Profile</strong> page.</li>
                                <li>Click "Download Configuration" to get your <code>.ovpn</code> file.</li>
                                <li>Run <code>sudo openvpn --config user.ovpn</code> in your terminal.</li>
                                <li>Verify connection by pinging <code>10.10.10.1</code> (Gateway).</li>
                            </ol>
                            <div className="alert alert-info">
                                Note: VPN access is required for Network Security labs.
                            </div>
                        </Card>

                        <Card className="mb-lg" id="api-reference">
                            <h2 className="text-xl font-bold mb-md">API Reference</h2>
                            <p className="text-muted mb-md">
                                Automate your training with our REST API. Base URL: <code>http://localhost:3000/api/v1</code>
                            </p>
                            <div className="code-block mb-md">
                                <code>
                                    GET /labs <br />
                                    Authorization: Bearer &lt;token&gt;
                                </code>
                            </div>
                            <p className="text-muted">
                                Full Swagger documentation is available at <code>/api/docs</code>.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Documentation;
