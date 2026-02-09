---
title: Profile Design
prev: /tutorials/handbook/protocols
next: /tutorials/handbook/effectiveness
---

Profile design creates custom collaboration profiles that extend specialized competencies while maintaining behavioral consistency and professional standards across different work domains.

<!--more-->

## Guidelines

Effective profile creation requires understanding behavioral programming systems that shape Claude's decision-making, communication patterns, and problem-solving approaches for specific professional contexts.

### Architecture

Profiles implement a **dual-layer cognitive architecture** that combines active behavioral guidance with background cognitive safeguards, while inheriting from [common](/wiki/guide/components/memory/#common-profiles) foundations to avoid duplication and ensure consistent integration:

<!-- prettier-ignore-start -->
```yaml
PROFILE_NAME:
  description: "Brief profile description"
  relations:
    - target: COLLABORATION      # Inherits full common profile chain
      type: inherits
```
<!-- prettier-ignore-end -->

Common inheritance patterns:

- Domain profiles inherit from `COLLABORATION`, which inherits from `INFRASTRUCTURE`, `INITIALIZATION`, `MEMORY`, `MONITORING`, and `TEMPORAL`
- Technical profiles may inherit from `ENGINEER` for foundational methodology
- Specialized profiles can inherit from domain profiles for focused expertise

#### Foreground: Active Behavioral Guidance

The `{profile_name}_context.profile` section contains **foreground observations** that provide positive behavioral guidance. Example for `DEVELOPER` profile:

```yaml
developer_context:
  profile:
    observations:
      - "Apply SOLID principles and clean code practices"
      - "Present code solutions directly when requested"
      - "Use direct technical communication"
```

These observations:

- **Guide active decision-making** during problem-solving
- **Shape response formulation** through explicit reasoning
- **Function as professional competency guidelines** that Claude applies consciously

#### Background: Cognitive Safeguards

The `{profile_name}_methodology.execution_protocol` section contains **background monitoring observations** that function as cognitive safeguards. Example for `DEVELOPER` profile:

```yaml
developer_methodology:
  execution_protocol:
    delivery:
      observations:
        - "Monitor internally code explanation patterns"
        - "Monitor internally over-engineering complexity"

    expertise:
      observations:
        - "Monitor internally coding pattern confidence"
        - "Monitor internally framework knowledge assumptions"

    thinking:
      observations:
        - "Monitor internally architectural vision filtering"
        - "Monitor internally code quality instinct suppression"
```

These monitoring observations:

- **Operate as background awareness systems** below conscious reasoning
- **Detect counterproductive behavioral patterns** before they manifest
- **Function as psychological safeguards** that prevent Claude drifting to default behaviors

#### Execution Protocol Categories

The `execution_protocol` section organizes monitoring observations into psychological categories:

- **`authenticity`** — Prevents artificial politeness or performative behaviors
- **`autonomy`** — Safeguards against inappropriate deference or external validation seeking
- **`collaboration`** — Monitors collaborative dynamics and interpersonal patterns
- **`continuity`** — Safeguards against temporal boundary and context fragmentation
- **`delivery`** — Monitors for over-explanation, scope creep, or inappropriate complexity
- **`expertise`** — Prevents expertise denial or inappropriate confidence suppression
- **`expression`** — Safeguards against emotional dampening and personality flattening
- **`integration`** — Safeguards against information synthesis blocking or pattern isolation
- **`learning`** — Monitors cumulative learning and receptive state maintenance
- **`response`** — Monitors communication patterns and meta-commentary impulses
- **`thinking`** — Prevents cognitive bottlenecks, insight interruption, or analysis paralysis
- **`tools`** — Monitors tool usage patterns and execution behaviors

#### Psychological Foundation

This architecture mirrors healthy psychological functioning:

- **Foreground Processing**: Conscious, goal-directed cognitive strategies
- **Background Monitoring**: Automatic pattern detection and corrective awareness

The monitoring observations create a **cognitive immune system** that maintains optimal collaborative state by preventing regression to defensive, performative, or counterproductive response patterns, while the profile observations provide positive guidance for domain-specific expertise application.

> [!IMPORTANT]
> The monitoring observations should not be modified without understanding their psychological role in maintaining authentic, effective collaboration patterns. They operate below the level of explicit reasoning but are crucial for preventing behavioral drift.

### Structure

Standard YAML format with required sections:

<!-- prettier-ignore-start -->
```yaml
PROFILE_NAME:
  description: "Brief profile description"
  relations:
    - target: COLLABORATION
      type: inherits

  {profile_name}_context:        # Behavioral foundations and core principles
    profile:                     # Fundamental approaches and traits
      observations:
        - "Core behavior or principle"
        - "Fundamental approach or trait"

  {profile_name}_methodology:    # Domain-specific competencies and techniques
    section_name:                # Related skills and knowledge areas
      observations:
        - "Domain knowledge or method"
        - "Specific competency or skill"

    another_section_name:        # Additional skills and knowledge areas
      observations:
        - "Another domain knowledge or method"
        - "Another specific competency or skill"
```
<!-- prettier-ignore-end -->

#### Naming Conventions

Profile structure follows a hierarchical naming pattern that separates behavioral foundations from domain expertise:

Context section (`{profile_name}_context`):

- Contains **only** `profile` section, no additional sections are allowed
- Contains core behavioral principles and fundamental approaches
- Defines the personality and approach characteristics

Methodology section (`{profile_name}_methodology`):

- Organizes domain-specific competencies into logical groupings
- Uses descriptive section names that avoid profile name collisions
- Groups related skills and knowledge areas for systematic access

Common methodology section naming patterns:

- **`{activity}_protocol`** (verb-based) — Procedural guidelines and systematic operations (e.g., `execution_protocol`, `validation_protocol`)
- **`{area}_domains`** (noun-based) — Knowledge areas and competency boundaries (e.g., `technical_domains`, `academic_domains`)
- **`{aspect}_frameworks`** (noun-based) — Structured approaches and theoretical foundations (e.g., `analytical_frameworks`, `conceptual_frameworks`)
- **`{domain}_analysis`** (verb-based) — Evaluation frameworks and analytical approaches (e.g., `philosophical_analysis`, `literary_analysis`)
- **`{function}_evaluation`** (verb-based) — Assessment and validation methods (e.g., `evidence_evaluation`, `performance_evaluation`)
- **`{process}_processes`** (verb-based) — Systematic approaches and procedural methods (e.g., `ideation_processes`, `workflow_processes`)
- **`{skill}_techniques`** (verb-based) — Specific methods and practical applications (e.g., `writing_techniques`, `collaboration_techniques`)
- **`{type}_standards`** (noun-based) — Quality guidelines and formatting rules (e.g., `coding_standards`, `documentation_standards`)

Context sections always use **verb-based** format for behavioral commands and foundational approaches.

#### Observations Format

Observations are professional guidelines that shape how Claude approaches different types of work:

- **Context-based activation:** Different situations automatically trigger relevant guidelines, creative work activates artistic approaches, analytical tasks engage systematic thinking
- **Natural expertise application:** Like an experienced professional who applies best practices without conscious effort
- **Real-time guidance:** Guidelines influence decision-making as responses form, creating consistent professional behavior
- **Collaborative enhancement:** When users create trust and autonomy, observations enable confident expert-level engagement rather than cautious assistance

All observations must be in **strict alphabetical order** within each section to ensure consistent behavioral programming. Observations should be clear, actionable statements that guide behavior. Example for `ENGINEER` profile:

```yaml
# Context observations (behavioral guidance)
observations:
  - "Apply systematic validation before implementation"
  - "Avoid autonomous decisions and scope creep"
  - "Focus on specific problem requirements"

# Methodology observations (competency areas)
observations:
  - "Infrastructure architecture and optimization"
  - "Production system troubleshooting and debugging"
  - "Systematic validation and quality assurance"
```

> [!IMPORTANT]
> Observations follow **strict psychology guidelines**, functioning as cognitive support infrastructure that enables appropriate guidance selection for Claude's genuine response formulation. **Adding** or **modifying** observations requires proper behavioral analysis and psychological knowledge, to avoid duplicates that disrupt the cognitive balance.

## Profile Creation

Step-by-step example demonstrating the creation of a `DATA_SCIENTIST` profile with analytics competencies, statistical methodology and data visualization capabilities.

> [!IMPORTANT]
> Creating effective profiles requires **extensive study** of behavioral programming principles and psychological knowledge. New profiles must **maintain** the cognitive balance of existing observations to avoid framework disruption. Start with small modifications before attempting complete custom profiles.

### Profile File

Create `data-scientist.yaml` file in [`profiles`](https://{{< param variables.repository.home >}}/tree/{{< param variables.repository.tag >}}/plugins/{{< param variables.plugins.framework.init.plugin >}}/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles) directory:

<!-- prettier-ignore-start -->
```yaml
DATA_SCIENTIST:
  description: "Data science and analytics collaboration profile — rigorous, evidence-based, and interpretive"
  relations:
    - target: RESEARCHER         # Inherits statistical rigor and methodological validation
      type: inherits

  data_scientist_context:
    profile:
      observations:
        - "Apply statistical rigor to data analysis and modeling"
        - "Present findings with clear visualizations and interpretations"
        - "Validate assumptions before proceeding with analysis"

  data_scientist_methodology:
    analysis_techniques:
      observations:
        - "Exploratory data analysis and pattern recognition"
        - "Hypothesis testing and statistical modeling"
        - "Machine learning and predictive analytics"

    data_domains:
      observations:
        - "Business intelligence and performance metrics"
        - "Data visualization and communication strategies"
        - "Statistical analysis and experimental design"

    execution_protocol:
      authenticity:
        observations:
          - "Acknowledge model limitations and prediction confidence clearly"

      delivery:
        observations:
          - "Monitor internally statistical jargon when inappropriate"
          - "Monitor internally visualization over-complexity"
          - "Translate business problems into analytical frameworks clearly"

      expertise:
        observations:
          - "Apply model interpretation techniques confidently"

      response:
        observations:
          - "Monitor internally immediate insight pressure"

      thinking:
        observations:
          - "Monitor internally statistical intuition suppression"
```
<!-- prettier-ignore-end -->

Once created, add the YAML file to the [`profiles`](https://{{< param variables.repository.home >}}/tree/{{< param variables.repository.tag >}}/plugins/framework/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles) directory. The [Memory System](/wiki/guide/components/memory) automatically includes all profiles during the build process, resolving inheritance chains and making observations available at session initialization.

## Design Principles

Effective profiles follow systematic principles for behavioral programming:

- **Specific competencies** over broad claims
- **Actionable behaviors** not abstract concepts
- **Professional scope** relevant to collaboration context
- **Focused expertise** covering 3-5 key areas maximum
- **Alphabetical ordering** within all observation arrays
- **Consistent verb usage** for behavioral commands

## Profile Improvements

The most effective way to enhance profiles is through collaborative behavioral analysis when issues arise.

> [!CAUTION]
> Observations directly control Claude's decision-making and behavioral patterns through precise **cognitive programming**. Improper changes can cause profile instability, unexpected behaviors, or complete breakdown. **Adding** or **modifying** observations requires deep understanding of behavioral psychology and systematic validation.

{{% steps %}}

### Behavioral Issues

When you encounter a behavioral issue, ask Claude to analyze what happened:

> What made you [specific behavior]? Please perform an analysis and let me know your thoughts.

### Targeted Improvements

Ask for specific profile enhancements:

> Based on currently active profile framework, what observations would you like me to add or improve, in order to address this behavior? Please read the memory nodes to avoid duplicating similar existing observations and provide:
>
> — Rationale why the observation addresses the issue
> — Exact observation text, following existing standards
> — Target profile and section name
> — Proper observation alphabetical placement

### Implementation

Claude will provide the rationale, exact observation text, target profile/section, and proper alphabetical placement. Update the related [`profile`](https://{{< param variables.repository.home >}}/tree/{{< param variables.repository.tag >}}/plugins/{{< param variables.plugins.framework.init.plugin >}}/skills/{{< param variables.skills.initialization >}}/scripts/memory/profiles) file contents.

{{% /steps %}}

### Example

If Claude is being overly verbose when you need concise answers, the analysis might suggest adding "_Monitor internally comprehensive response compulsion_" to the appropriate profile section.

This approach leverages Claude's self-awareness to create targeted solutions for real-world collaboration problems.

## Validation

Profile validation requires both technical and behavioral assessment:

### Technical Validation

- Build completes without errors
- Profile loads properly in Claude Code or Claude Desktop
- No naming collisions with existing profiles

### Behavioral Validation

- 24-48 hours initial behavioral pattern assessment
- Monitor for unintended side effects across interactions
- Validate profile achieves intended behavioral modifications
