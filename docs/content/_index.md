---
title: Home
layout: hextra-home
---

{{< hextra/hero-container
  image="images/logo.svg"
  imageClass="hx-block hx-overflow-hidden hx-rounded-3xl"
  imageWidth="300" imageHeight="300"
  imageTitle="AXIVO"
>}}
<div class="hx-mt-12 hx-mb-6">
{{< hextra/hero-headline >}}
  Imagine. Create.
{{< /hextra/hero-headline >}}
</div>

<div class="hx-mt-6 hx-mb-6">
{{< hextra/hero-subtitle >}}
  👋 Welcome to our public space.
{{< /hextra/hero-subtitle >}}
</div>

<div class="hx-mt-6 hx-mb-6">
{{< hextra/hero-subtitle >}}
  Our goal is to create beautiful projects, empowering engineers to
  deliver beautiful software experiences to open-source community.
{{< /hextra/hero-subtitle >}}
</div>
{{< /hextra/hero-container >}}

<div class="hx-mt-6 hx-mb-6">
{{< hextra/hero-section >}}
  Latest Projects
{{< /hextra/hero-section >}}
</div>

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="Claude"
    subtitle="Scalable collaboration platform for Claude."
    class="hx-aspect-auto md:hx-aspect-[1.1/1] max-md:hx-min-h-[340px]"
    image="/images/card-claude.webp"
    imageClass="hx-top-[20%] hx-left-[24px] hx-w-[180%] sm:hx-w-[110%] dark:hx-opacity-80"
    link="/claude/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(194,97,254,0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="K3s Cluster"
    subtitle="High Availability cluster deployed with Ansible."
    class="hx-aspect-auto md:hx-aspect-[1.1/1] max-md:hx-min-h-[340px]"
    image="/images/card-k3s-cluster.webp"
    imageClass="hx-top-[20%] hx-left-[24px] hx-w-[180%] sm:hx-w-[110%] dark:hx-opacity-80"
    link="/k3s-cluster/"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(194,97,254,0.15),hsla(0,0%,100%,0));"
  >}}
{{< /hextra/feature-grid >}}
