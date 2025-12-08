# TOR Online System - Diagrams & Documentation

Dokumentasi lengkap untuk Entity Relationship Diagram (ERD) dan Flow Diagram sistem TOR Online.

---

## 1. Entity Relationship Diagram (ERD)

### Database Schema Overview

```mermaid
erDiagram
    User ||--o| Position : "has"
    Position }o--|| Bidang : "belongs to"
    Position ||--o{ PositionRole : "has many"
    PositionRole }o--|| Role : "for"
    Position ||--o{ PositionBidangAccess : "has access"
    PositionBidangAccess }o--|| Bidang : "to"

    Bidang ||--o{ Workflow : "has"
    Workflow ||--o{ WorkflowStep : "contains"
    WorkflowStep }o--|| Position : "assigned to"

    User ||--o{ Tor : "creates"
    Bidang ||--o{ Tor : "owns"
    Tor ||--o{ TorBudgetItem : "has"
    Tor ||--o{ TorApprovalHistory : "has history"

    User ||--o{ TorApprovalHistory : "acts on"

    User {
        int id
        string name
        string username
        string email
        string passwordHash
        int positionId
        boolean isSuperAdmin
        boolean isActive
    }

    Position {
        int id
        string name
        string code
        int bidangId
        boolean isGlobal
        int levelOrder
        boolean isActive
    }

    Bidang {
        int id
        string name
        string code
        boolean isActive
    }

    PositionBidangAccess {
        int id
        int positionId
        int bidangId
    }

    Role {
        int id
        string name
        string description
    }

    PositionRole {
        int positionId
        int roleId
    }

    Workflow {
        int id
        string name
        int bidangId
        boolean isActive
    }

    WorkflowStep {
        int id
        int workflowId
        int stepNumber
        string label
        int positionId
        string statusStage
        boolean canRevise
        int revisionTargetStep
        boolean isLastStep
    }

    Tor {
        int id
        string number
        string title
        int bidangId
        int creatorUserId
        int currentStepNumber
        string statusStage
        boolean isFinalApproved
        boolean isExported
    }

    TorBudgetItem {
        int id
        int torId
        string item
        decimal quantity
        string unit
        decimal unitPrice
        decimal totalPrice
    }

    TorApprovalHistory {
        int id
        int torId
        int stepNumber
        string action
        string fromStatusStage
        string toStatusStage
        int actedByUserId
        string actedByNameSnapshot
        string actedByPositionSnapshot
        string note
    }
```

---

## 2. Authentication & Authorization Flow

### Login Process

```mermaid
flowchart TD
    Start([User opens Login Page]) --> InputCreds[User enters username & password]
    InputCreds --> SubmitForm[Submit login form]
    SubmitForm --> APILogin[POST /api/login]

    APILogin --> FindUser{Find user by username}
    FindUser -->|Not found| ReturnError1[Return error: User not found]
    FindUser -->|Found| CheckActive{User is active?}

    CheckActive -->|No| ReturnError2[Return error: Account inactive]
    CheckActive -->|Yes| VerifyPassword{Verify password hash}

    VerifyPassword -->|Invalid| ReturnError3[Return error: Invalid password]
    VerifyPassword -->|Valid| CreateSession[Create session cookie]

    CreateSession --> LoadUserData[Load user with position & bidang]
    LoadUserData --> ReturnSuccess[Return success + user data]
    ReturnSuccess --> RedirectDashboard[Redirect to /dashboard or /tor]

    ReturnError1 --> ShowError[Display error message]
    ReturnError2 --> ShowError
    ReturnError3 --> ShowError
    ShowError --> InputCreds

    RedirectDashboard --> End([User logged in])
```

### Authorization Check (Middleware)

```mermaid
flowchart TD
    Request([Incoming Request]) --> CheckCookie{Session cookie exists?}

    CheckCookie -->|No| Redirect401[Redirect to /login]
    CheckCookie -->|Yes| VerifyToken{Verify JWT token}

    VerifyToken -->|Invalid| Redirect401
    VerifyToken -->|Valid| GetUser[Get user from database]

    GetUser --> CheckUserActive{User is active?}
    CheckUserActive -->|No| Redirect403[Error: Account deactivated]
    CheckUserActive -->|Yes| LoadPermissions[Load user position & roles]

    LoadPermissions --> AttachToRequest[Attach user to request context]
    AttachToRequest --> AllowAccess([Allow request to proceed])

    Redirect401 --> BlockAccess([Block access])
    Redirect403 --> BlockAccess
```

---

## 3. TOR Approval Workflow System

### Workflow Configuration per Bidang

```mermaid
flowchart LR
    Bidang[Bidang] --> Workflow[Workflow Configuration]
    Workflow --> Step1[Step 1: APPROVAL_1]
    Workflow --> Step2[Step 2: APPROVAL_2]
    Workflow --> Step3[Step 3: APPROVAL_3]
    Workflow --> Step4[Step 4: APPROVAL_4]

    Step1 --> Pos1[Position: Assistant Manager]
    Step2 --> Pos2[Position: Assistant Manager]
    Step3 --> Pos3[Position: Manager]
    Step4 --> Pos4[Position: Assistant Manager]

    Step1 -.can revise to.-> Step1
    Step2 -.can revise to.-> Step1
    Step3 -.can revise to.-> Step2
    Step4 -.can revise to.-> Step3
```

### TOR Lifecycle - Complete Flow

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Creator creates TOR

    DRAFT --> APPROVAL_1: Submit for approval
    APPROVAL_1 --> APPROVAL_2: Step 1 approves
    APPROVAL_2 --> APPROVAL_3: Step 2 approves
    APPROVAL_3 --> APPROVAL_4: Step 3 approves
    APPROVAL_4 --> FINAL_APPROVED: Step 4 approves (Last step)

    APPROVAL_1 --> REVISION: Step 1 requests revision
    APPROVAL_2 --> REVISION: Step 2 requests revision
    APPROVAL_3 --> REVISION: Step 3 requests revision
    APPROVAL_4 --> REVISION: Step 4 requests revision

    APPROVAL_1 --> REJECTED: Step 1 rejects
    APPROVAL_2 --> REJECTED: Step 2 rejects
    APPROVAL_3 --> REJECTED: Step 3 rejects
    APPROVAL_4 --> REJECTED: Step 4 rejects

    REVISION --> APPROVAL_1: Creator re-submits after revision

    FINAL_APPROVED --> EXPORTED: Export to DOCX
    EXPORTED --> [*]: Process complete

    REJECTED --> [*]: TOR rejected

    note right of DRAFT
        Only creator can edit
        currentStepNumber = 0
    end note

    note right of APPROVAL_1
        Waiting for approval
        currentStepNumber = 1
        Approver can: Approve/Revise/Reject
    end note

    note right of FINAL_APPROVED
        isFinalApproved = true
        No more approvals needed
        Ready for export
    end note
```

### Approval Action Process

```mermaid
flowchart TD
    Start([User clicks action button]) --> CheckAuth{User authorized for current step?}

    CheckAuth -->|No| Error403[Error: Not authorized]
    CheckAuth -->|Yes| ActionType{Select action}

    ActionType -->|Approve| GetNextStep[Get next workflow step]
    GetNextStep --> CheckLastStep{Is last step?}
    CheckLastStep -->|Yes| SetFinalApproved[Set isFinalApproved = true]
    CheckLastStep -->|No| MoveToNext[Move to next step]

    ActionType -->|Revise| GetRevisionTarget[Get revision target step]
    GetRevisionTarget --> SetRevision[Set statusStage = REVISION]
    SetRevision --> ResetStep[Set currentStepNumber to target]

    ActionType -->|Reject| SetRejected[Set as REJECTED]

    SetFinalApproved --> CreateHistory1[Create approval history record]
    MoveToNext --> CreateHistory1
    ResetStep --> CreateHistory2[Create approval history record]
    SetRejected --> CreateHistory3[Create approval history record]

    CreateHistory1 --> UpdateTOR1[Update TOR in database]
    CreateHistory2 --> UpdateTOR1
    CreateHistory3 --> UpdateTOR1

    UpdateTOR1 --> SendNotif[Send notification to relevant users]
    SendNotif --> ReturnSuccess[Return success response]

    Error403 --> End([Action blocked])
    ReturnSuccess --> End([Action completed])
```

### Cross-Bidang Approval Access

```mermaid
flowchart TD
    User[User with Position] --> CheckAccess{Check approval access}

    CheckAccess --> OwnBidang[Access to own Bidang TORs]
    CheckAccess --> CrossBidang{Has PositionBidangAccess?}

    CrossBidang -->|Yes| OtherBidang[Access to other Bidang TORs]
    CrossBidang -->|No| NoAccess[No access to other Bidangs]

    OwnBidang --> CanApprove1[Can approve TORs from own Bidang]
    OtherBidang --> CanApprove2[Can approve TORs from specified Bidangs]

    CanApprove1 --> Example1[Example: Manager Boiler can approve Boiler TORs]
    CanApprove2 --> Example2[Example: Super Admin can approve all Bidang TORs]
```

---

## 4. TOR Dashboard & Filtering Logic

### Dashboard Views

```mermaid
flowchart TD
    Dashboard([TOR Dashboard]) --> ViewChoice{Select view}

    ViewChoice -->|My TORs| MyTORsLogic{Is Super Admin?}
    ViewChoice -->|Pending Approvals| ApprovalLogic[Filter TORs needing my approval]

    MyTORsLogic -->|Yes| AllTORs[Show all TORs in system]
    MyTORsLogic -->|No| CreatorTORs[Show TORs created by me]

    AllTORs --> Stats1[Calculate stats: Total, Draft, Pending, Completed]
    CreatorTORs --> Stats1

    ApprovalLogic --> GetMyPositions[Get my position & bidang access]
    GetMyPositions --> GetWorkflows[Get workflows I can approve]
    GetWorkflows --> FilterByStep[Filter TORs where currentStepNumber matches my steps]
    FilterByStep --> ExcludeDraft[Exclude DRAFT status]
    ExcludeDraft --> ExcludeCompleted[Exclude isFinalApproved = true]

    ExcludeCompleted --> Stats2[Calculate stats: Pending approvals count]

    Stats1 --> DisplayList1[Display TOR list with cards]
    Stats2 --> DisplayList2[Display TOR list with cards]

    DisplayList1 --> ShowProgress[Show approval progress bar]
    DisplayList2 --> ShowProgress

    ShowProgress --> End([Dashboard rendered])
```

---

## 5. System Architecture Overview

### Application Layers

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[Next.js Pages & Components]
        Login[Login Page]
        Dashboard[Dashboard]
        TORForm[TOR Form Tabs]
        Admin[Admin Pages]
    end

    subgraph "API Layer"
        AuthAPI[/api/login, /api/logout]
        ProfileAPI[/api/profile]
        TORAPI[/api/tor/*]
        ApprovalAPI[/api/tor/[id]/approve]
        AdminAPI[/api/admin/*]
    end

    subgraph "Business Logic"
        AuthService[Authentication Service]
        WorkflowEngine[Workflow Approval Engine]
        TORService[TOR CRUD Service]
        ExportService[DOCX Export Service]
    end

    subgraph "Data Layer"
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL Database)]
    end

    UI --> AuthAPI
    UI --> ProfileAPI
    UI --> TORAPI
    UI --> ApprovalAPI
    UI --> AdminAPI

    AuthAPI --> AuthService
    ProfileAPI --> AuthService
    TORAPI --> TORService
    ApprovalAPI --> WorkflowEngine
    AdminAPI --> TORService

    AuthService --> Prisma
    WorkflowEngine --> Prisma
    TORService --> Prisma
    ExportService --> Prisma

    Prisma --> PostgreSQL
```

---

## 6. Key Enums & Status Definitions

### TorStatusStage

| Status       | Description                  | Who Can Edit       |
| ------------ | ---------------------------- | ------------------ |
| `DRAFT`      | Initial state, not submitted | Creator only       |
| `APPROVAL_1` | Waiting for step 1 approval  | Approver at step 1 |
| `APPROVAL_2` | Waiting for step 2 approval  | Approver at step 2 |
| `APPROVAL_3` | Waiting for step 3 approval  | Approver at step 3 |
| `APPROVAL_4` | Waiting for step 4 approval  | Approver at step 4 |
| `REVISION`   | Sent back for revision       | Creator only       |

### TorActionType

| Action    | Description               | Effect                                         |
| --------- | ------------------------- | ---------------------------------------------- |
| `SUBMIT`  | Submit draft for approval | Changes status from DRAFT to APPROVAL_1        |
| `APPROVE` | Approve current step      | Moves to next step or sets final approval      |
| `REVISE`  | Request revision          | Sets status to REVISION, resets to target step |
| `REJECT`  | Reject TOR completely     | TOR cannot proceed further                     |
| `EXPORT`  | Export to DOCX            | Generates Word document                        |

---

## 7. Security & Permissions

### Role-Based Access Control

```mermaid
flowchart TD
    User[User] --> HasPosition[Has Position]
    HasPosition --> HasRoles[Position has Roles]

    HasRoles --> RoleCreator{Role: CREATOR?}
    HasRoles --> RoleApprover{Role: APPROVER?}
    HasRoles --> RoleAdmin{Role: ADMIN?}
    HasRoles --> RoleSuperAdmin{isSuperAdmin flag?}

    RoleCreator -->|Yes| CanCreate[Can create & edit own TORs]
    RoleApprover -->|Yes| CanApprove[Can approve TORs at assigned steps]
    RoleAdmin -->|Yes| CanManage[Can manage users, positions, bidangs]
    RoleSuperAdmin -->|Yes| SuperAccess[Full access to everything]

    CanApprove --> CheckStep{TOR at my approval step?}
    CheckStep -->|Yes| ApprovalActions[Can: Approve/Revise/Reject]
    CheckStep -->|No| NoAction[Cannot act on this TOR]

    SuperAccess --> Override[Can override any permission check]
```

---

## Summary

Sistem TOR Online adalah aplikasi manajemen dokumen Terms of Reference dengan fitur:

1. **Authentication**: Login berbasis username/password dengan session management
2. **Multi-level Approval**: Workflow approval hingga 4 tingkat per bidang
3. **Cross-Bidang Access**: Position dapat meng-approve TOR dari bidang lain
4. **Dynamic Workflow**: Setiap bidang memiliki konfigurasi approval sendiri
5. **Audit Trail**: Semua aksi tercatat di TorApprovalHistory
6. **RBAC**: Role-based access control dengan Position dan Role
7. **Export**: Generate DOCX dengan semua data TOR

Database menggunakan PostgreSQL dengan Prisma ORM, dan seluruh sistem berjalan di Next.js 15 dengan App Router.
