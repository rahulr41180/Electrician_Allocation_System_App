
import "../CSS/NavbarComponent.css"

import { Link } from "react-router-dom";

import { FaShopware } from "react-icons/fa";

export const NavbarComponent = () => {

    return (
        <div id="   ">
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <Link to={"/"} className="navbar-brand" style={{ textTransform: "none" }}><FaShopware /> rR e-Com</Link>

                        {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to={""}>Home</Link>
                                
                            </li>
                            
                        </ul> */}
                    </div>
                </div>
            </nav>
        </div>
    )

}