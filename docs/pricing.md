---
id: pricing
slug: /pricing
title: Cloud pricing
sidebar_position: 2
description: Usage-based pricing for Moondream Cloud, including per-model token rates, batch rates, Lens fine-tuning rates, included features, and validity details.
---

# Cloud pricing

Moondream runs anywhere. For the easiest, fastest, and cheapest way to use it, with no setup required, there’s Moondream Cloud.

## Standard plan

### Usage model

- Usage-based billing based on tokens.
- Pay-as-you-go. Charges accrue automatically as you send requests; no minimum commitment.
- Dense grounding tokens ensure grounding-heavy prompts stay efficient.

### Token rates

All prices are USD per 1M tokens. [Batch API](/batch) requests are billed at 50% off real-time rates.

<table>
  <thead>
    <tr>
      <th rowSpan={2} style={{verticalAlign: 'middle'}}>Model</th>
      <th colSpan={2} style={{textAlign: 'center'}}>Real-time</th>
      <th colSpan={2} style={{textAlign: 'center'}}>Batch</th>
    </tr>
    <tr>
      <th style={{width: '13%', textAlign: 'right'}}>In</th>
      <th style={{width: '13%', textAlign: 'right'}}>Out</th>
      <th style={{width: '13%', textAlign: 'right'}}>In</th>
      <th style={{width: '13%', textAlign: 'right'}}>Out</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Moondream 3.1 9B A2B (<code>moondream3.1-9B-A2B</code>)</td>
      <td style={{textAlign: 'right'}}>$0.30</td>
      <td style={{textAlign: 'right'}}>$1.00</td>
      <td style={{textAlign: 'right'}}>$0.15</td>
      <td style={{textAlign: 'right'}}>$0.50</td>
    </tr>
    <tr>
      <td>Moondream 3 Preview (<code>moondream3-preview</code>)</td>
      <td style={{textAlign: 'right'}}>$0.30</td>
      <td style={{textAlign: 'right'}}>$2.50</td>
      <td style={{textAlign: 'right'}}>$0.15</td>
      <td style={{textAlign: 'right'}}>$1.25</td>
    </tr>
  </tbody>
</table>

:::note
Moondream 3 Preview continues to be offered at its original rates. As new models are released, each will be listed here with its own rates.
:::

### Lens fine-tuning

| Item | Price |
|------|-------|
| Training | $0.60 per million training tokens |

Rollout inference during training and inference on your finetuned checkpoints are billed at the base model's cloud rates above. See the [fine-tuning docs](/finetuning) for details.

:::info Start instantly
Create an account and launch requests immediately (no sales conversations required!).
:::

### Included benefits

- Dense grounding token support, so grounding-rich workloads consume fewer tokens.
- $5.00 in free credits added every month to jumpstart new experiments.
- Privacy-first operations; we never train Moondream models on your data.
- Transparent billing history and usage dashboards for every workspace.

### Validity & refunds

- Prepaid tokens remain valid for 12 months from purchase.
- Unused tokens expire after one year and are non-refundable, except where required by law.
- Reach out to support if you believe a charge is incorrect so we can investigate promptly.

## Enterprise plan

Need a higher-volume contract, on-prem deployment, or tailored consulting support? Our enterprise plan covers bespoke requirements with dedicated technical guidance. Contact sales at [sales@moondream.ai](mailto:sales@moondream.ai) or [schedule a call](https://cal.com/moondream-sales) to scope a solution with our team.
