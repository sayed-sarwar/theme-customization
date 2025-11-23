import Page from "@/pages/page";
import Report from "@/pages/report";
import Dashboard from "@/pages/dashborad";

export const componentMap: { [key: string]: any } = {
  Page: Page,
  Report: Report,
  Dashboard: Dashboard,
  default: Page,
};
