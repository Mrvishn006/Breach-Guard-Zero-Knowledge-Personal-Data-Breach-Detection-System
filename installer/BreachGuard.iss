; Inno Setup Script for BreachGuard
; Generates standalone user-facing installer: BreachGuard-Setup.exe

#define MyAppName "BreachGuard"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "BreachGuard Security Team"
#define MyAppURL "https://github.com/Mrvishn006/Breach-Guard-Zero-Knowledge-Personal-Data-Breach-Detection-System"
#define MyAppExeName "BreachGuard.exe"

[Setup]
AppId={{D982C028-E5D7-45E4-8492-7AD9E52D8E1E}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DisableProgramGroupPage=yes
LicenseFile=
OutputDir=..\release
OutputBaseFilename=BreachGuard-Setup
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed=x64compatible or x64
ArchitecturesInstallIn64BitMode=x64compatible or x64
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
SetupIconFile=breachguard.ico
UninstallDisplayIcon={app}\resources\breachguard.ico
UninstallDisplayName={#MyAppName} Cyber Defense SOC

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Packaged Application Binaries and Resources
Source: "..\release\BreachGuard-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; Bundled RansomWatch Kernel Driver Assets
Source: "..\driver\*"; DestDir: "{app}\resources\driver"; Flags: ignoreversion recursesubdirs createallsubdirs
; Application Icon Resource
Source: "breachguard.ico"; DestDir: "{app}\resources"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; IconFilename: "{app}\resources\breachguard.ico"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon; IconFilename: "{app}\resources\breachguard.ico"

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}\resources"
Type: filesandordirs; Name: "{app}"
