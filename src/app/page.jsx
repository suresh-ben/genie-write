import React from "react";

import Sidebar from "@/components/layout/Sidebar";
import Home from "@/components/Home";

export default async function Page() {
    return (
        <div className="flex relative">
            <Home />
            <Sidebar />
        </div>
    );
}
