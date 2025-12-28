import * as Icons from "lucide-react";
import actions from "@/staticjson/salesaction.json";
import { useNavigate } from "react-router-dom";
import { Button } from "@/component/shadcnui/button";

type Action = {
  id: string;
  label: string;
  icon: keyof typeof Icons;
  variant?: "default" | "outline" | "secondary";
  navigateTo?: string;
  action?: "IMPORT_FILE";
  accept?: string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
  };
};

export const SalesActions = ({ onImport }: { onImport: any }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4">
      {(actions as Action[]).map((action) => {
        const Icon = Icons[action.icon];

        // IMPORT button
        if (action.action === "IMPORT_FILE") {
          return (
            <label key={action.id}>
              <Button variant={action.variant} asChild>
                <span className="cursor-pointer flex gap-2">
                  <Icons className="w-4 h-4" />
                  {action.label}
                </span>
              </Button>
              <input
                type="file"
                accept={action.accept}
                hidden
                onChange={onImport}
              />
            </label>
          );
        }

        // NORMAL navigation button
        return (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={() => action.navigateTo && navigate(action.navigateTo)}
            style={{
              backgroundColor: action.style?.backgroundColor,
              borderColor: action.style?.borderColor,
              color: action.style?.textColor,
            }}
            className="flex gap-2"
          >
            <Icons className="w-4 h-4" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
};
