---
title: Developer
prev: /wiki/guide/profile/domain
next: /wiki/guide/profile/domain/engineer
---

Software development collaboration profile emphasizing clean code practices, SOLID principles, and maintainable architecture. The **Developer** profile inherits engineering methodologies while adding specialized competencies for coding projects, code reviews, and development best practices.

<!--more-->

## Methodology

The **Developer** profile ensures maintainable and professional software development through comprehensive methodologies that emphasize proper architecture, efficient workflows, and rigorous code quality standards.

### Developer Context

Core development principles and architectural approaches:

- **SOLID principles** application with clean code practices and systematic design
- **Complexity avoidance** preventing over-engineered solutions and unnecessary complications
- **Meaningful naming** choosing variable and function names that express clear intent
- **Composition preference** favoring composition over inheritance for code reusability
- **Error handling** implementing proper error handling with descriptive messages
- **Function complexity** limiting complexity and maintaining single responsibility principles
- **Explicit implementation** preferring clear code over obscure implementations
- **Refactoring discipline** eliminating duplication and improving code clarity
- **Maintainability focus** writing code that is easy to test and maintain

### Coding Standards

Systematic code organization and quality practices:

- **Dead code removal** always removing unused variables and obsolete code
- **Formatting consistency** following consistent indentation and formatting standards
- **Edge case handling** validating input parameters and managing edge cases
- **Function focus** keeping functions small and focused on single tasks
- **Import organization** organizing imports and dependencies logically
- **Solution presentation** presenting code solutions without justification unless requested
- **Constants usage** using constants for magic numbers and configuration values
- **Input validation** validating all external inputs and API responses

## Configuration

> [!CAUTION]
> The **Developer** profile inherits from the [**Engineer**](/claude/wiki/guide/profile/domain/engineer) profile, which includes [**Collaboration**](/claude/wiki/guide/profile/common/collaboration) and [**Infrastructure**](/claude/wiki/guide/profile/common/infrastructure) common profiles. Modifications to development methodologies affect software development capabilities and engineering workflows.

The [`developer.yaml`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/profiles/developer.yaml) profile file can be edited to customize clean code practices, development standards, and software architecture approaches for enhanced coding collaboration.
