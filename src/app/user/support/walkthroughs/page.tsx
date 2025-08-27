"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WalkthroughsView from "@/components/views/WalkthroughsView";
import React from "react";

const walkthroughs = () => {
  return (
    <DashboardLayout>
      <WalkthroughsView />
    </DashboardLayout>
  );
};

export default walkthroughs;
