import { Button } from "@/component/shadcnui/button";

interface ActionButton {
  label: string;
  icon: string;
  type: string;
  action: string;
  url: string;
}

interface ViewPageLayoutProps {
  title: string;
  primaryButton: ActionButton;
  secondaryButtons: ActionButton[];
  onAction: (action: string, url: string) => void;
  children: React.ReactNode;
}

const ViewPageLayout = ({
  title,
  primaryButton,
  secondaryButtons,
  onAction,
  children,
}: ViewPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    onAction(primaryButton.action, primaryButton.url)
                  }
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span className="material-symbols-outlined text-base">
                    {primaryButton.icon}
                  </span>
                  {primaryButton.label}
                </Button>
                {secondaryButtons.map((button, index) => (
                  <Button
                    onClick={() => onAction(button.action, button.url)}
                    key={index}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">
                      {button.icon}
                    </span>
                    {button.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ViewPageLayout;
