import itemjData from "../staticjson/itemj.json";

const Setting = () => {
  const data = itemjData as any[];
  const name = data[0];
  const children = data[1] as any[];
  const allApps = children[0] as any[];
  const appName = allApps[0];
  const description = allApps[1];
  const iconLink = allApps[2];
  const icon = allApps[3];
  const hasChildren = allApps[4];
  const appChildren = allApps[5] as any[];

  const accounting = appChildren[0] as any[];
  const accountingName = accounting[0];
  const accountingIconLink = accounting[1];
  const accountingPath = accounting[2];
  const accountingIcon = accounting[3];
  const submenu = accounting[4];

  const hr = appChildren[1] as any[];
  const hrName = hr[0];
  const hrIconLink = hr[1];
  const hrIcon = hr[2];
  const hrPath = hr[3];
  const hrItem = hr[4];

  const crm = appChildren[2] as any[];
  const crmName = crm[0];
  const crmDescription = crm[1];
  const crmIconLink = crm[2];
  const crmIcon = crm[3];
  const crmPath = crm[4];
  const crmItem = crm[5];

  const customApp = appChildren[3] as any[];
  const customName = customApp[0];
  const customDescription = customApp[1];
  const customIconLink = customApp[2];
  const customIcon = customApp[3];
  const customPath = customApp[4];
  const customItem = customApp[5];

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <div style={{width: '250px', backgroundColor: '#f5f5f5', padding: '20px', borderRight: '1px solid #ddd'}}>
        <h2 style={{fontSize: '18px', fontWeight: '600', marginBottom: '20px'}}>Menu</h2>
        <ul style={{listStyle: 'none', padding: 0}}>
          <li style={{marginBottom: '10px'}}>
            <a href={accountingPath} style={{textDecoration: 'none', color: '#333', padding: '10px', display: 'block', borderRadius: '4px', backgroundColor: '#fff'}}>
              <i className={accountingIconLink} style={{marginRight: '10px'}}></i>
              {accountingName}
            </a>
          </li>
          <li style={{marginBottom: '10px'}}>
            <a href={hrPath} style={{textDecoration: 'none', color: '#333', padding: '10px', display: 'block', borderRadius: '4px', backgroundColor: '#fff'}}>
              <i className={hrIconLink} style={{marginRight: '10px'}}></i>
              {hrName}
            </a>
          </li>
          <li style={{marginBottom: '10px'}}>
            <a href={crmPath} style={{textDecoration: 'none', color: '#333', padding: '10px', display: 'block', borderRadius: '4px', backgroundColor: '#fff'}}>
              <i className={crmIconLink} style={{marginRight: '10px'}}></i>
              {crmName}
            </a>
          </li>
          <li style={{marginBottom: '10px'}}>
            <a href={customPath} style={{textDecoration: 'none', color: '#333', padding: '10px', display: 'block', borderRadius: '4px', backgroundColor: '#fff'}}>
              <i className={customIconLink} style={{marginRight: '10px'}}></i>
              {customName}
            </a>
          </li>
        </ul>
      </div>
      <div style={{flex: 1, padding: '20px'}}>
        <h1 style={{fontSize: '32px', fontWeight: 'bold'}}>Settings</h1>
        <div>
          <h2 style={{fontSize: '24px', fontWeight: '600'}}>Root Name: {name}</h2>
          <h3 style={{fontSize: '20px', fontWeight: '500'}}>App Name: {appName}</h3>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Description: {description}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Icon Link: {iconLink}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Has Children: {String(hasChildren)}</p>

          <h3 style={{fontSize: '20px', fontWeight: '500'}}>Accounting Module</h3>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Name: {accountingName}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Path: {accountingPath}</p>

          <h3 style={{fontSize: '20px', fontWeight: '500'}}>HR Module</h3>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Name: {hrName}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Path: {hrPath}</p>

          <h3 style={{fontSize: '20px', fontWeight: '500'}}>CRM Module</h3>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Name: {crmName}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Description: {crmDescription}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Path: {crmPath}</p>

          <h3 style={{fontSize: '20px', fontWeight: '500'}}>Custom App</h3>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Name: {customName}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Description: {customDescription}</p>
          <p style={{fontSize: '16px', fontWeight: '400'}}>Path: {customPath}</p>
        </div>
      </div>
    </div>
  );
};

export default Setting;
