---
title: Profile Design
prev: /tutorials/handbook/profile
next: /tutorials/handbook/profile/drift
---

Systematic methodology for creating custom collaboration profiles that extend specialized competencies while maintaining behavioral consistency and professional collaboration standards.

<!--more-->

## Guidelines

Profile creation and design requires understanding behavioral programming systems that directly control Claude's decision-making, communication patterns and problem-solving approaches. Profiles are hierarchical structures that separate universal collaboration patterns from domain-specific expertise.

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

## Profile Creation

Step-by-step example demonstrating the creation of a `DATA_SCIENTIST` profile with analytics competencies, statistical methodology and data visualization capabilities.

> [!CAUTION]
> This example demonstrates profile structure and syntax. Creating effective profiles requires extensive study of behavioral programming principles and thorough testing. Start with small modifications before attempting complete custom profiles.

### Profile File

Create `data-scientist.yaml` file in [`profiles`](https://{{< param variables.repository.home >}}/tree/main/.claude/tools/memory/profiles) directory:

```yaml
DATA_SCIENTIST:
  description: "Data science and analytics collaboration profile"
  relations:
    - target: COLLABORATION
      type: inherits
    - target: INFRASTRUCTURE
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
```

### Build Configuration

Add the new profile to [`builder.yaml`](https://{{< param variables.repository.home >}}/blob/main/.claude/tools/memory/config/builder.yaml) configuration file:

```yaml
build:
  profiles:
    - data-scientist.yaml  # Add your profile
```

Run the following commands to [build](/claude/wiki/guide/platform/memory/builder) the Memory System [configuration file](https://{{< param variables.repository.home >}}/blob/main/.claude/memory.json):

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

> [!IMPORTANT]
> Profile creation modifies core behavioral patterns. Incorrect implementation can cause behavioral dysfunction requiring immediate rollback capability.
