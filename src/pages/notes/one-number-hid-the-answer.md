---
layout: ../../layouts/Note.astro
title: "A correlation of 0.77 was not the answer"
description: "Why one strong number made USPS vacancy data look better than it is, and the three questions that told the real story."
date: "2026-10-12"
project: can-mail-data-predict-housing-vacancy
cover: insight-correlation-by-county.png
readingTime: "4 min read"
---

The Census Bureau's housing vacancy rate is the gold standard, but it comes out once a year and lags what is happening on the ground. USPS publishes vacancy counts every quarter for every ZIP code. So I asked a simple question: **can the faster source stand in for the slower one?**

I built the comparison on Microsoft Fabric: raw USPS and Census ACS files landed in a Lakehouse, a Dataflow Gen2 consolidated them into one county-year table (6 counties, 2010–2024, 84 observations), and a semantic model served it to Power BI.

## The number that looked like a yes

The first measure I wrote was a Pearson correlation across all 84 observations. It came back at **r = 0.77**. That is a strong relationship, and it would have been easy to stop there and call USPS a good proxy.

> A pooled correlation answers "do these move together on average?", not "can I trust this for my county?"

## Splitting it into three questions

Instead of one verdict, I asked three separate questions:

- **Correlation, per county.** Pooled r was 0.77, but per county it ranged from **−0.01** (Champaign) to **0.72** (Montgomery). The strong pooled number hid how unevenly USPS tracks Census from one county to the next.
- **Direction.** When Census vacancy goes up or down year over year, does USPS move the same way? Only **57.7%** of the time.
- **Bias.** The narrow USPS estimate reads about 5.3 points below Census, and the broad one about 2.7 points above. No single correction factor fixes both.

## What I concluded

USPS mail data is a **county-dependent early-warning signal**, not a substitute for the Census. In some counties it is worth watching; in others it says almost nothing.

The habit I kept: when one summary number looks like the answer, break it apart by the unit people will actually make decisions about. Here, that unit was the county.
