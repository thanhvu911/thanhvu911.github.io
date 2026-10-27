---
layout: ../../layouts/Note.astro
title: "Two silent bugs in a Fabric pipeline"
description: "Neither bug threw an error. One broke column matching; the other quietly deleted my join key."
date: "2026-09-28"
project: can-mail-data-predict-housing-vacancy
cover: code-dataflow-gen2-lakehouse.png
readingTime: "3 min read"
---

The worst data bugs don't fail. The refresh succeeds, the visuals render, and the numbers are wrong. My USPS-vs-Census pipeline on Microsoft Fabric had two of them.

The setup: raw USPS quarterly files and Census ACS files land untouched in a Lakehouse. A Dataflow Gen2 (Power Query M) combines the quarterly USPS files, rolls them up to county-year, and joins them to Census on FIPS code and year.

## Bug 1: header casing

The USPS files were not consistent about the capitalization of their column headers across releases. Power Query matches column names exactly, so when the files were combined, columns that were "the same" to a human did not line up.

**Fix:** normalize headers before combining, so every file presents the same column names to the next step.

## Bug 2: the county key disappeared

Each USPS file's name identified its county. When I used **Combine Files**, the generated steps dropped the filename column, which meant the county key was gone before the join. Nothing errored; the data just could no longer be attributed correctly.

**Fix:** restore the source filename column explicitly and derive the county key from it.

## One more trap: a change that looks like a finding

In 2012 USPS changed how it classifies addresses. In a chart, that shows up as a shift that looks like a real trend. I treated it as a **data artifact, not a finding**, and noted it rather than explaining it as housing-market behavior.

## The habit

After any combine or append step, check that the columns, keys, and row counts you expect are still there. A quick look at both would have surfaced these bugs right away.
