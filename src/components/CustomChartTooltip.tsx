import React from "react";
import { TooltipProps } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const CustomChartTooltip = ({
  active,
  payload,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;

  return (
    <Card className="shadow-lg border border-border/50">
      <CardContent className="p-3">
        <div className="text-sm">
          <p className="font-medium">{data.name || data.category || ""}</p>
          <p className="text-muted-foreground">
            Amount:
            <span className="font-mono font-medium">
              ₹{data.value || data.amount || 0}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomChartTooltip;
