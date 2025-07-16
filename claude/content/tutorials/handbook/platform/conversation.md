---
title: Conversation Logs
prev: /tutorials/handbook/platform
next: /tutorials/handbook/platform/diary
---

Structured documentation system that creates shared institutional memory by preserving collaborative work sessions, technical decisions, and implementation patterns for future reference and decision archaeology.

<!--more-->

## Guidelines

Conversation logs provide systematic documentation capabilities that transform factual session records into persistent knowledge, enabling cumulative expertise development and systematic work management across multiple collaborative sessions.

### Purpose

- Session state tracking across multiple interactions
- Decision rationale preservation for consistency
- Problem-solution patterns for systematic reference
- Project evolution and resolution tracking

### Trigger Phrases

Use specific phrases to activate conversation logs functionality. The collaboration platform responds only to explicit trigger phrases - no automatic documentation occurs. Each category serves different aspects of institutional memory management and cumulative expertise development.

#### Creating New Logs

- "*Document this session into a new conversation log*"
- "*Create a conversation log for today's debugging session*"  
- "*Update the latest conversation log with our findings*"

#### Retrieving Existing Logs

- "*Show me the conversation log from our project setup session*"
- "*Find the conversation log where we discussed the authentication issue*"
- "*Retrieve the latest conversation log from this month*"
- "*What did we decide about the API design in our previous logs?*"
- "*Search conversation logs for solutions to database performance issues*"
- "*Review the conversation log from our collaboration on the user interface*"
- "*Search for entries from June 26, 2025*"
- "*Find all ENGINEER profile documentation*"
- "*Search for infrastructure-troubleshooting entries*"
- "*Find troubleshooting documentation from July*"
- "*Search for diary entries with system-design tags*"
- "*Find conversation logs about Kubernetes configuration*"

#### Referencing Information

- "*What approaches did we try in Session 15 according to the logs?*"
- "*Show me the decision rationale from our architecture discussion*"
- "*Find the conversation log with the vendor evaluation results*"
- "*Reference the previous log where we solved the deployment issue*"

## Template

### Structure

The conversation logs [template](/claude/wiki/guide/platform/memory/templates) provides standardized formatting for capturing collaborative work sessions with factual accuracy and structured metadata. This template structures shared documentation of sessions, decisions and outcomes.

> [!NOTE]
> The [`conversation.md`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/templates/conversation.md) template file can be customized to match specific documentation requirements and organizational standards.

### Real-World Examples

The following [first log](https://{{< param variables.repository.home >}}/blob/main/.claude/data/conversations/2025/07/10-helm-chart-microservice.md) and [second log](https://{{< param variables.repository.home >}}/blob/main/.claude/data/conversations/2025/07/10-victoriametrics-memory-fix.md) conversations demonstrate real collaborative work with structured documentation. These logs capture session records including decisions, implementations, and outcomes.

### Complementary Documentation

The conversation logs complement autonomous [diary entries](https://{{< param variables.repository.home >}}/blob/main/.claude/data/diary/2025/07/10.md) which contain Claude's private reflections on the same sessions. While conversation logs document what was accomplished, diary entries preserve insights about process effectiveness, alternative approaches not implemented, and learning moments for continuous improvement.

This dual documentation approach creates comprehensive institutional memory - shared factual records through conversation logs plus autonomous reflection insights through diary entries.
