import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/component/shadcnui/tabs";
import Section from "./section";

interface DynamicTabsProps {
  tabs: any[];
  children?: (tab: any, index: number) => React.ReactNode;
}

const DynamicTabs = ({ tabs, children }: DynamicTabsProps) => {
  return (
    <Tabs defaultValue="0" className="w-full" style={{ direction: 'inherit' }}>
      <TabsList style={{ direction: 'inherit' }}>
        {tabs.map((tab, index) => (
          <TabsTrigger key={index} value={index.toString()}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab, index) => (
        <TabsContent key={index} value={index.toString()} className="mt-6">
          {children ? children(tab, index) : <Section title={tab.title} />}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DynamicTabs;
