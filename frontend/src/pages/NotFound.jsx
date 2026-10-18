import { Link } from "react-router-dom";
import "../css/NotFound.css";

const NotFound = () => (
    <div className="page notfound">
        <p className="notfound-code num">404</p>
        <h1 className="page-title">This page doesn't exist</h1>
        <p className="page-sub">The link may be wrong, or the page may have moved.</p>
        <div className="notfound-actions">
            <Link to="/" className="btn btn-primary">
                Go home
            </Link>
            <Link to="/BrowseTopics" className="btn btn-line">
                Browse topics
            </Link>
        </div>
    </div>
);

export default NotFound;
