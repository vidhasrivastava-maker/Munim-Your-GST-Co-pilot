// Fictional sample data only. Taken from the munim concept designs — not real client documents.
export const business = { name: "Verma Traders", gstin: "09ABCDE1234F1Z5" };
export const lawyer = { name: "Adv. Rao", city: "Lucknow" };

export type Claim = { title: string; amount: number; plain: string };
export const notice = {
  form: "DRC-01", title: "Show cause notice", received: "5 Oct", replyBy: "10 Nov", demanded: 102800,
  claims: [
    { title: "Extra input tax credit", amount: 62000, plain: "The department says you claimed more tax credit than your suppliers' filings support." },
    { title: "Sales not reported", amount: 32400, plain: "The department thinks some sales were missing from your returns." },
    { title: "Late fee and interest", amount: 8400, plain: "Charges for filing or paying after the due date." },
  ] as Claim[],
};
export const hearing = { form: "DRC-01", date: "24 Nov", time: "11:00 am" };
export const upcoming = [
  { label: "GSTR-1", date: "13 Jan" },
  { label: "PMT-06", date: "25 Nov" },
];
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const SAMPLE_NOTICE = `FORM GST DRC-01
Show Cause Notice
To: Verma Traders, GSTIN 09ABCDE1234F1Z5
It is observed that input tax credit of Rs 62,000 has been availed in excess of that reflected in GSTR-2B. Further, outward supplies of Rs 32,400 tax value appear unreported in GSTR-3B. Interest and late fee of Rs 8,400 is also payable. You are directed to show cause within 30 days why the total demand of Rs 1,02,800 should not be confirmed.`;
