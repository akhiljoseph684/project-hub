"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ProjectFeature {
  key: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  required?: boolean;
  scrumOnly?: boolean;
}

interface FeatureToggleProps {
  feature: ProjectFeature;
  onChange: (key: string, enabled: boolean) => void;
}

export default function FeatureToggle({
  feature,
  onChange,
}: FeatureToggleProps) {
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border p-5 transition-all",
        feature.enabled
          ? "border-primary/30 bg-primary/5"
          : "hover:bg-muted/50",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-lg border bg-background p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{feature.name}</h3>

            {feature.required && <Badge variant="secondary">Required</Badge>}

            {feature.scrumOnly && <Badge variant="outline">Scrum</Badge>}
          </div>

          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      </div>

      <Switch
        checked={feature.enabled}
        disabled={feature.required}
        onCheckedChange={(checked) => onChange(feature.key, checked)}
      />
    </div>
  );
}
