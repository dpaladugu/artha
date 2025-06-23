# Artha: Personal Finance Command Center

**Zero Complexity. Full Control. Powered by AI.**

Artha is a self-hosted, AI-enhanced, Excel-native personal finance system built for individuals who want full ownership of their data, with a frictionless interface via CLI, Telegram, and a mobile-optimized dashboard.

---

## 🚀 Features

* 💬 English-only Telegram bot commands
* 📊 Excel-based backend (OneDrive)
* 📈 Apache Superset dashboard
* 🤖 AI-powered insights via DeepSeek
* 🧩 Modular CLI tools (`artha-cli`)
* 🔒 Azure AD + TLS-based access control

---

## 📦 Folder Structure

```bash
artha-finance/
├── cloudflare-worker/     # API logic
├── cli/                   # artha-cli tool
├── excel-template/        # OneDrive-connected workbook
├── docs/                  # Documentation and guides
└── dashboard/             # Superset or Chart.js dashboard
```

---

## 📥 Quick Setup

### 1. Clone the repo

```bash
git clone https://github.com/artha-finance/core
cd core
```

### 2. Install CLI

```bash
npm install -g artha-cli
```

### 3. Initialize

```bash
artha-cli config set language english
artha-cli init
```

---

## 💬 Telegram Commands

```bash
# Vehicle operations
/add_vehicle vehicle=Shine odo=42300 fuel=500
/service_vehicle vehicle=Shine type=chain cost=850

# Income & expense
/add_income amount=32000 category=Salary
/add_expense amount=2200 category=Fuel vehicle=Shine

# Queries
/net_worth
/vehicle_status Shine
/gold_value
```

---

## 🖥️ Sample Terminal Output

```bash
$ artha-cli add vehicle=Shine odo=42300
✔ Vehicle entry recorded (ODO: 42300 | Date: 2024-07-01)

$ artha-cli report net_worth
💰 Net Worth: ₹42,80,000 (+2.3%)

$ artha-cli gold_value
🪙 Gold Holdings: ₹1,23,000 (15g @ ₹8200/g)
```

---

## 📱 Screenshots

> *Replace these links with actual images during final doc publishing*

* [📊 Superset Dashboard (mobile)](https://demo.artha.finance/dashboard)
* [💬 Telegram Command Demo](https://demo.artha.finance/telegram-demo)
* [📁 Excel Template Preview](https://artha.finance/templates/core_v1.0.xlsx)

---

## 🔐 Security

* OAuth2 via Azure AD for Microsoft Graph
* Only preapproved user IDs can write to Excel
* TLS 1.3 enforced across all endpoints
* Sheet protection for backups and critical logs

---

## 📚 Documentation

* [🔧 CLI Docs](https://docs.artha.finance/cli)
* [📊 Dashboard Guide](https://docs.artha.finance/dashboard)
* [🔐 Auth Setup](https://docs.artha.finance/security)

---

## 🧠 Insights Engine (DeepSeek)

> Artha uses prompt-engineered queries to extract financial insights like:

* Loan repayment optimization
* Vehicle cost/km alerts
* SIP vs EMI trade-offs
* Emergency fund coverage gaps

---

## 🤝 License

MIT License — Open-sourced and forever free.

> *"Artha gives you enterprise-grade financial control without enterprise complexity — your data, your rules, zero compromises."*
