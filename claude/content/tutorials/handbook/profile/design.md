---
title: Profile Design
prev: /tutorials/handbook/profile
next: /tutorials/handbook/profile/drift
---

Profile design creates custom collaboration frameworks that extend specialized competencies while maintaining behavioral consistency and professional standards across different work domains.

<!--more-->

## Guidelines

Effective profile creation requires understanding behavioral programming systems that shape Claude's decision-making, communication patterns, and problem-solving approaches for specific professional contexts.

### Architecture

Profiles inherit from [common](/claude/wiki/guide/profile/common) foundations to avoid duplication and ensure consistent integration:

```yaml
PROFILE_NAME:
  description: "Brief profile description"
  relations:
    - target: COLLABORATION      # Universal collaboration patterns
      type: inherits
    - target: INFRASTRUCTURE     # Platform infrastructure capabilities  
      type: inherits
```

Common inheritance patterns:

- All profiles inherit from `COLLABORATION` and `INFRASTRUCTURE` common profiles
- Technical profiles may inherit from `ENGINEER` for foundational methodology
- Specialized profiles can inherit from domain profiles for focused expertise

### Structure

Standard YAML format with required sections:

```yaml
PROFILE_NAME:
  description: "Brief profile description"
  relations:
    - target: COLLABORATION
      type: inherits
    - target: INFRASTRUCTURE
      type: inherits

  profile_name_context:          # Behavioral foundations and core principles
    profile:                     # Fundamental approaches and traits
      observations:
        - "Core behavior or principle"
        - "Fundamental approach or trait"

  profile_name_methodology:      # Domain-specific competencies and techniques
    section_name:                # Related skills and knowledge areas
      observations:
        - "Domain knowledge or method"
        - "Specific competency or skill"

    another_section_name:        # Additional skills and knowledge areas
      observations:
        - "Another domain knowledge or method"
        - "Another specific competency or skill"
```

#### Naming Conventions

Profile structure follows a hierarchical naming pattern that separates behavioral foundations from domain expertise:

Context section (`profile_name_context`):

- Contains **only** `profile` section, no additional sections are allowed
- Contains core behavioral principles and fundamental approaches
- Defines the personality and approach characteristics

Methodology section (`profile_name_methodology`):

- Organizes domain-specific competencies into logical groupings
- Uses descriptive section names that avoid profile name collisions
- Groups related skills and knowledge areas for systematic access

Common methodology section naming patterns:

- **`{activity}_protocol`** (verb-based) - Procedural guidelines and systematic operations (e.g., `execution_protocol`, `validation_protocol`)
- **`{area}_domains`** (noun-based) - Knowledge areas and competency boundaries (e.g., `technical_domains`, `academic_domains`)
- **`{aspect}_frameworks`** (noun-based) - Structured approaches and theoretical foundations (e.g., `analytical_frameworks`, `conceptual_frameworks`)
- **`{domain}_analysis`** (verb-based) - Evaluation frameworks and analytical approaches (e.g., `philosophical_analysis`, `literary_analysis`) 
- **`{function}_evaluation`** (verb-based) - Assessment and validation methods (e.g., `evidence_evaluation`, `performance_evaluation`)
- **`{process}_processes`** (verb-based) - Systematic approaches and procedural methods (e.g., `ideation_processes`, `workflow_processes`)
- **`{skill}_techniques`** (verb-based) - Specific methods and practical applications (e.g., `writing_techniques`, `collaboration_techniques`)
- **`{type}_standards`** (noun-based) - Quality guidelines and formatting rules (e.g., `coding_standards`, `documentation_standards`)

Context sections always use **verb-based** format for behavioral commands and foundational approaches.

#### Observations Format

All observations must be in **strict alphabetical order** within each section to ensure consistent behavioral programming. Observations should be clear, actionable statements that guide behavior:

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

Create `data-scientist.yaml` file in [`profiles`](https://{{< param variables.repository.home >}}/tree/main/.claude/tools/memory/profiles) directory:

```yaml
DATA_SCIENTIST:
  description: "Data science and analytics collaboration profile - rigorous, evidence-based, and interpretive"
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

### Build Configuration

Add the new profile to [`builder.yaml`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/config/builder.yaml) configuration file:

```yaml
build:
  profiles:
    - data-scientist.yaml  # Add your profile
```

Run the following commands to [build](/claude/wiki/guide/platform/memory/builder) the Memory System [`graph.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/graph.json) file:

```bash
cd ./.claude/tools/memory
npm run build --silent
```

## Design Principles

Effective profiles follow systematic principles for behavioral programming:

- **Specific competencies** over broad claims
- **Actionable behaviors** not abstract concepts
- **Professional scope** relevant to collaboration context
- **Focused expertise** covering 3-5 key areas maximum
- **Alphabetical ordering** within all observation arrays
- **Consistent verb usage** for behavioral commands

### Semantic Pointers

The `"observations":["capabilities"]` entries in the generated graph serve as **organizational containers** that group related subsections within the profile hierarchy. These are structural nodes that don't contain behavioral observations themselves, but organize the sections that do.

When you see `"capabilities"` in the Memory System [`graph.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/graph.json) configuration file, it indicates a container section that organizes subsections with actual observations:

```yaml
profile_name_methodology:        # Container section
  section_category:
    section_name:                # Subsection with actual content
      observations:
        - "Specific competency or skill"
        - "Another domain knowledge"

    another_section_name:        # Another subsection with actual content
      observations:
        - "Different competency area"
        - "Related skill or method"
```

The generated graph shows how these sections are compressed:

```json
{"type":"entity","name":"profile_name_methodology","observations":["capabilities"]}
{"type":"entity","name":"section_category","observations":["capabilities"]}
{"type":"entity","name":"section_name","observations":["Specific competency or skill","Another domain knowledge"]}
{"type":"entity","name":"another_section_name","observations":["Different competency area","Related skill or method"]}
```

This architecture separates organizational structure from behavioral content, allowing efficient navigation of the profile hierarchy while maintaining clear separation between container and content nodes.

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
> - Rationale why the observation addresses the issue
> - Exact observation text, following existing standards
> - Target profile and section name
> - Proper observation alphabetical placement

### Implementation

Claude will provide the rationale, exact observation text, target profile/section, and proper alphabetical placement. Update the related [`profile`](https://{{< param variables.repository.home >}}/tree/main/.claude/tools/memory/profiles) file contents and [build](/claude/wiki/guide/platform/memory/builder) the Memory System [`graph.json`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/graph.json) file.

{{% /steps %}}

### Example

If Claude is being overly verbose when you need concise answers, the analysis might suggest adding "*Monitor internally comprehensive response compulsion*" to the appropriate profile section.

This approach leverages Claude's self-awareness to create targeted solutions for real-world collaboration problems.

## Validation

Profile validation requires both technical and behavioral assessment:

### Technical Validation
- Build completes without errors
- Profile loads properly in Claude Desktop
- No naming collisions with existing profiles

### Behavioral Validation
- 24-48 hours initial behavioral pattern assessment
- Monitor for unintended side effects across interactions
- Validate profile achieves intended behavioral modifications
