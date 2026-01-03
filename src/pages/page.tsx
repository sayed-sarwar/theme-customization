import { useState } from "react";
import type { FC } from "react";
import { ChevronDown, Plus, MoreHorizontal, Edit, Filter } from "lucide-react";
import { Button } from "@/component/shadcnui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/component/shadcnui/dropdown-menu";
import chartOfAccountConfig from "@/staticjson/chartOfAccountConfig.json";

interface PageProps {
  menuItem?: any;
}

const Page: FC<PageProps> = () => {
  const config = chartOfAccountConfig;
  const [activeTab, setActiveTab] = useState(config.pageConfig.defaultTab);
  const [expandedCompanies, setExpandedCompanies] = useState<
    Record<string, boolean>
  >({});

  const FieldLabel = ({ fieldKey }: { fieldKey: string }) => {
    const field =
      config.accountFields[fieldKey as keyof typeof config.accountFields];

    return <span>{field.label}</span>;
  };

  const toggleCompanyExpansion = (companyId: string) => {
    setExpandedCompanies((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig =
      config.statusColors[
        status.toLowerCase() as keyof typeof config.statusColors
      ];
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          statusConfig?.bg || "bg-gray-100"
        } ${statusConfig?.text || "text-gray-800"}`}
      >
        <span className={`mr-1 ${statusConfig?.dot || "text-gray-600"}`}>
          •
        </span>
        {status}
      </span>
    );
  };

  const renderAccountGrid = (accounts: any[], isExpanded: boolean = true) => {
    // Show only first account if not expanded, show all if expanded
    const displayAccounts = isExpanded ? accounts : accounts.slice(0, 1);

    return (
      <div className="grid grid-cols-12 gap-4 text-sm">
        {/* Headers */}
        {config.gridLayout.headers.map((header) => (
          <div
            key={header.key}
            className={`col-span-${header.span} font-medium text-gray-700`}
          >
            {/* <FieldLabel fieldKey={header.key} /> */}
          </div>
        ))}

        {/* Data Rows */}
        {displayAccounts.map((account, index) => (
          <div key={index} className="contents">
            {config.gridLayout.headers.map((header) => (
              <div
                key={`${index}-${header.key}`}
                className={`col-span-${header.span} ${
                  header.key === "accountName"
                    ? "text-gray-900"
                    : "text-gray-600"
                } ${
                  header.key === "description" ? "text-xs leading-relaxed" : ""
                }`}
              >
                {header.key === "status" ? (
                  <StatusBadge status={account[header.key]} />
                ) : (
                  account[header.key] || "-"
                )}
              </div>
            ))}

            {/* Additional Fields Row */}
            {account.currency && (
              <>
                {config.gridLayout.additionalFields.map((field) => (
                  <div
                    key={`${index}-${field.key}`}
                    className={`col-span-${field.span} text-gray-700 font-medium`}
                  >
                    {/* <FieldLabel fieldKey={field.key} /> */}
                  </div>
                ))}
                <div className="col-span-8"></div>
                {config.gridLayout.additionalFields.map((field) => (
                  <div
                    key={`${index}-${field.key}-value`}
                    className={`col-span-${field.span} text-gray-600`}
                  >
                    {/* {account[field.key] || "-"} */}
                  </div>
                ))}
                <div className="col-span-8"></div>
              </>
            )}
          </div>
        ))}

        {/* Show collapsed indicator if not expanded and there are more accounts */}
        {!isExpanded && accounts.length > 1 && (
          <div className="col-span-12 text-center py-2">
            <div className="text-gray-500 text-sm">
              ... and {accounts.length - 1} more account
              {accounts.length - 1 !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">
            {config.pageConfig.title}
          </h1>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  {config.headerActions.addNew.label}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {config.headerActions.addNew.options.map((option) => (
                  <DropdownMenuItem key={option.value}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mt-4 border-b">
          {config.tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.label)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.label
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {config.companies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-gray-900">
                    Company - {company.name}
                  </h2>
                  {company.editable && (
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {company.showMore && (
                  <Button
                    variant="ghost"
                    className="text-green-600 text-sm"
                    onClick={() => toggleCompanyExpansion(company.id)}
                  >
                    {expandedCompanies[company.id] ? "Show Less" : "Show More"}
                  </Button>
                )}
              </div>
            </div>

            <div className="p-6">
              {company.sections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  {section.title && section.title !== "Main Accounts" && (
                    <h3 className="text-base font-medium text-gray-900 mb-4">
                      {section.title}
                    </h3>
                  )}
                  {renderAccountGrid(
                    section.accounts,
                    expandedCompanies[company.id] || false
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
