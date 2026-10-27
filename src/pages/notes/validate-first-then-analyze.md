---
layout: ../../layouts/Note.astro
title: "Validate first, then analyze"
description: "The order I now use on every dataset, from a 1,000-row bank table to a 131M-row warehouse."
date: "2025-09-15"
project: grocery-transaction-data-warehouse
cover: code-silver-quality-checks.png
readingTime: "3 min read"
---

It is tempting to open a new dataset and start answering the business questions right away. Every project I have done has taught me to go in a different order: **prove the data can be trusted, fix what is broken, then analyze.**

## On a small dataset

My bank transaction project in SQL Server had two tables: 1,000 transactions and 800 customer accounts. Before any analysis, `validation.sql` ran:

- NULL checks on every column
- duplicate-key checks
- distinct-value profiling, and distributions for every categorical column

Only then did `transform.sql` standardize missing transaction amounts, and only then did `analysis.sql` look at volume by branch, currency, credit-score band, account type, and hour of day.

## On a large one

The same idea scales. In my grocery warehouse (131M+ rows, 1M+ customers, 25K products) the checks became automated test suites that run after each layer loads:

- **Silver:** null or duplicate keys, unwanted whitespace, broken references between tables, and unexpected categorical values such as gender, loyalty tier, and nationality.
- **Gold:** surrogate-key uniqueness and referential integrity between the fact table and its dimensions.

The Medallion layout helps here. Because Bronze keeps an untouched copy of the source, any problem found in Silver can be traced back and the load re-run, instead of patched by hand.

## Why the order matters

An analysis built on unchecked data is only as good as its worst column. Validation is the cheapest point to find that column, before it ends up in a dashboard that someone uses to make a decision.
