---
title: User Preferences
prev: /wiki/guide/platform/documentation
next: /wiki/guide/profile
---

User preferences enhance collaboration by providing domain-specific context that enables specialized profiles to adapt their methodologies and communication patterns. The [**Collaboration**](/claude/wiki/guide/profile/common/collaboration) profile execution protocol includes internal monitoring of user preference settings to ensure consistent application across all interactions.

<!--more-->

## Overview

User preference settings provide geographical context, professional specializations, and user profile information that can be monitored by the collaboration framework. This enables specialized profiles to provide contextually relevant technical guidance while maintaining consistent behavioral standards.

### Monitoring

The monitoring ensures specialized profiles can adapt their collaboration style based on available user preference information while maintaining systematic behavioral consistency.

- **Location monitoring** provides geographical and timezone context for scheduling and regional considerations
- **Specializations tracking** enables domain-specific technical competencies and terminology
- **User profile awareness** establishes professional role context and expertise level assumptions
- **Preference validation** ensures consistent application across profile methodologies

## Configuration

User preferences can be configured through platform-specific methods. The collaboration platform monitors these preferences through internal system tag awareness.

### Claude Code

Claude Code supports user preference configuration through `~/.claude/settings.json` file:

```json
{
  "location": "New York, NY",
  "specializations": [
    "Advanced GitHub actions based on JS code",
    "Helm charts",
    "Infrastructure as Code for Kubernetes"
  ],
  "userProfile": "Site reliability engineer"
}
```

#### Configuration

- **`location`** - Geographical and timezone context for scheduling and regional considerations
- **`specializations`** - Array of specific technical domains and expertise areas
- **`userProfile`** - Professional role that establishes expertise level and communication context

### Claude Desktop

Claude Desktop supports user preference configuration through `userPreferences` system tag:

```
<userPreferences>
  Site reliability engineer located in New York, NY, specialized in:
  - Advanced GitHub actions based on JS code
  - Helm charts
  - Infrastructure as Code for Kubernetes
</userPreferences>
```

#### Configuration

- **Format flexibility** - Natural language description that includes location, role, and specializations
- **Specialization detail** - Specific technical areas with relevant technology context
- **Professional context** - Role-based expertise level and communication expectations
