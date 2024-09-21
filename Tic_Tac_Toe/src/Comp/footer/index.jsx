import React from "react";

const Footer = () => {
    return (
        <footer className="flex flex-col  bg-slate-900 text-gray-600  text-center p-4">
                <p>
                    Created by{" "}
                    <a href="https://github.com/hasanasadov/">
                        {" "}
                        Hasanali Asadov{" "}
                    </a>
                </p>
                <a href="https://github.com/hasanasadov/Code_Academy_React_Games">
                    Source Code
                </a>
            </footer>
    );
}

export default Footer