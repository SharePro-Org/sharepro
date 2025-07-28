import React, { useState } from "react";

import { CustomSelect } from "@/components/ui/custom-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CircleMinus } from "lucide-react";

const rewardTypes = [
  { label: "Gold", value: "Gold" },
  { label: "Silver", value: "Silver" },
  { label: "Bronze", value: "Bronze" },
];

const Tiers = ({
  tiers,
  handleTierChange,
  handleRemoveTier,
  handleAddTier,
}: {
  tiers: any;
  handleTierChange: any;
  handleRemoveTier: any;
  handleAddTier: any;
}) => {
  return (
    <section>
      <div className="">
        {tiers.map((tier: any, idx: any) => (
          <div
            key={idx}
            className="grid md:grid-cols-3 gap-4 items-end md:py-4 rounded-md relative"
          >
            <div>
              <Label
                htmlFor={`tier-name-${idx}`}
                className="block mb-2 text-sm"
              >
                Tier Name
              </Label>
              <CustomSelect
                options={rewardTypes}
                value={tier.name}
                onChange={(val) => handleTierChange(idx, "name", val)}
                placeholder="Gold"
              />
            </div>
            <div>
              <Label htmlFor={`points-${idx}`} className="block mb-2 text-sm">
                Points Threshold
              </Label>
              <Input
                id={`points-${idx}`}
                placeholder="300+ referrals"
                className="w-full"
                value={tier.pointsRequired}
                onChange={(e) =>
                  handleTierChange(idx, "pointsRequired", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`benefits-${idx}`} className="block mb-2 text-sm">
                Tier Benefits
              </Label>
              <Input
                id={`benefits-${idx}`}
                placeholder="20% off every order"
                className="w-full"
                value={tier.benefits}
                onChange={(e) =>
                  handleTierChange(idx, "benefits", e.target.value)
                }
              />
            </div>
            {tiers.length > 1 && (
              <button
                type="button"
                className="absolute top-10 cursor-pointer right-2 text-xs"
                onClick={() => handleRemoveTier(idx)}
              >
                <CircleMinus size={15} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 text-primary cursor-pointer py-2 transition text-sm font-medium"
        onClick={handleAddTier}
      >
        Add Tier
      </button>
    </section>
  );
};

export default Tiers;
