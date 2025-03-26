// Supabase Configuration
const SUPABASE_URL = "https://ejwcrofakhcyujbkrgzm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqd2Nyb2Zha2hjeXVqYmtyZ3ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NzMwNjUsImV4cCI6MjA1ODM0OTA2NX0.DKk5y05u7GmWbrUazCAqV3X6uXiuUGQu2ai7PRZ-LYQ";

// Hardcoded credentials
const AUTO_LOGIN_EMAIL = "fahizp3@gmail.com";
const AUTO_LOGIN_PASSWORD = "Fahiz@2003";

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Generic fetch function
async function fetchData(table) {
  try {
    const { data, error } = await supabaseClient.from(table).select("*");

    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    return null;
  }
}

// Show/Hide loader functions
function showLoader() {
  const loader = document.getElementById("preloader");
  if (loader) {
    loader.style.display = "flex";
    loader.style.opacity = "1";
  }
}

function hideLoader() {
  const loader = document.getElementById("preloader");
  if (loader) {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }
}

// Initialize data loading
async function initializeData() {
  try {
    const [
      navItems,
      navSettings,
      heroData,
      aboutData,
      servicesSettings,
      servicesData,
      ctaData,
      featuresSettings,
      featuresData,
      clientsData,
      statsSettings,
      faqSettings,
      faqData,
      rewardsSettings,
      rewardsData,
      contactData,
    ] = await Promise.all([
      fetchData("navigation_menu_items"),
      fetchData("navigation_settings"),
      fetchData("hero_settings"),
      fetchData("about_settings"),
      fetchData("services_settings"),
      fetchData("services"),
      fetchData("cta_settings"),
      fetchData("features_settings"),
      fetchData("features"),
      fetchData("clients_items"),
      fetchData("stats_settings"),
      fetchData("faq_settings"),
      fetchData("faq_items"),
      fetchData("rewards_settings"),
      fetchData("rewards_items"),
      fetchData("contact_settings"),
    ]);

    if (navItems) updateNavbar(navItems);
    if (navSettings?.[0]) updateNavigationSettings(navSettings[0]);
    if (heroData) updateHero(heroData);
    if (aboutData) updateAbout(aboutData);
    if (servicesSettings && servicesData)
      updateServices(servicesSettings, servicesData);
    if (ctaData) updateCTA(ctaData);
    if (featuresSettings && featuresData)
      updateFeatures(featuresSettings, featuresData);
    if (clientsData) updateClients(clientsData);
    if (statsSettings) updateStats(statsSettings[0]);
    if (faqSettings && faqData) updateFAQ(faqSettings, faqData);
    if (rewardsSettings && rewardsData)
      updateRewards(rewardsSettings, rewardsData);
    if (contactData) updateContact(contactData);

    // Show content with smooth transition
    document.body.style.transition = "opacity 0.3s ease-in";
    document.body.style.opacity = "1";

    // Hide loader
    hideLoader();
  } catch (err) {
    console.error("Initialization error:", err);
    document.body.style.opacity = "1";
    hideLoader();
  }
}

// Update hero section
function updateHero(data) {
  if (!data || !data[0]) return;
  const hero = data[0];

  const heroSection = document.querySelector("#hero");
  if (!heroSection) return;

  const bgImage = heroSection.querySelector("img");
  if (bgImage && (hero.background_image_url_ar || hero.background_image_url)) {
    bgImage.src = hero.background_image_url_ar || hero.background_image_url;
    bgImage.alt = hero.title_ar || hero.title || "";
  }

  const title = heroSection.querySelector("h2");
  if (title) title.textContent = hero.title_ar || hero.title;

  const subtitle = heroSection.querySelector("p");
  if (subtitle) subtitle.textContent = hero.subtitle_ar || hero.subtitle;

  const ctaBtn = heroSection.querySelector(".btn-get-started");
  if (ctaBtn) {
    ctaBtn.textContent = hero.cta_text_ar || hero.cta_text || "ابدأ الآن";
    ctaBtn.href = hero.cta_link || "#about";
  }
}

// Update about section
function updateAbout(data) {
  if (!data || !data[0]) return;
  const about = data[0];

  const aboutSection = document.querySelector("#about");
  if (!aboutSection) return;

  const title = aboutSection.querySelector(".section-title h2");
  if (title) title.textContent = about.title_ar || about.title;

  const subtitle = aboutSection.querySelector(".section-title p");
  if (subtitle) subtitle.textContent = about.subtitle_ar || about.subtitle;

  const mainContent = aboutSection.querySelector(".content p");
  if (mainContent)
    mainContent.textContent = about.main_content_ar || about.main_content;

  // Update bullet points
  const bulletPoints = aboutSection.querySelectorAll(".content li");
  if (bulletPoints && about.bullet_points_ar) {
    about.bullet_points_ar.forEach((point, index) => {
      if (bulletPoints[index]) {
        const span = bulletPoints[index].querySelector("span");
        if (span) span.textContent = point;
      }
    });
  }

  const rightContent = aboutSection.querySelector(".col-lg-6:last-child p");
  if (rightContent)
    rightContent.textContent =
      about.secondary_content_ar || about.secondary_content;

  const readMoreLink = aboutSection.querySelector(".read-more");
  if (readMoreLink) {
    readMoreLink.href = about.read_more_link || "#";
    readMoreLink.querySelector("span").textContent = "اقرأ المزيد";
  }
}

// Update services section
function updateServices(settings, services) {
  if (!settings || !settings[0]) return;
  const setting = settings[0];

  const servicesSection = document.querySelector("#services");
  if (!servicesSection) return;

  const title = servicesSection.querySelector(".section-title h2");
  if (title) title.textContent = setting.title_ar || setting.title;

  const description = servicesSection.querySelector(".section-title p");
  if (description)
    description.textContent = setting.description_ar || setting.description;

  const serviceItems = servicesSection.querySelector(".row");
  if (!serviceItems || !services) return;

  // Sort services by order_number
  const sortedServices = [...services].sort(
    (a, b) => a.order_number - b.order_number
  );

  serviceItems.innerHTML = sortedServices
    .map(
      (service) => `
    <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
      <div class="service-item position-relative">
        <div class="icon">
          <i class="bi ${service.icon}"></i>
        </div>
        <h3>${service.title_ar || service.title}</h3>
        <p>${service.description_ar || service.description}</p>
      </div>
    </div>
  `
    )
    .join("");
}

// Update CTA section
function updateCTA(data) {
  if (!data || !data[0]) return;
  const cta = data[0];

  const ctaSection = document.querySelector("#call-to-action");
  if (!ctaSection) return;

  const bgImage = ctaSection.querySelector("img");
  if (bgImage && (cta.background_image_url_ar || cta.background_image_url)) {
    bgImage.src = cta.background_image_url_ar || cta.background_image_url;
    bgImage.alt = cta.title_ar || cta.title || "";
  }

  const title = ctaSection.querySelector("h3");
  if (title) title.textContent = cta.title_ar || cta.title;

  const description = ctaSection.querySelector("p");
  if (description)
    description.textContent = cta.description_ar || cta.description;

  const button = ctaSection.querySelector(".cta-btn");
  if (button) {
    button.textContent = cta.button_text_ar || cta.button_text || "ابدأ الآن";
    button.href = cta.button_link || "#";
  }
}

// Update features section
function updateFeatures(settings, features) {
  if (!settings || !settings[0]) return;
  const setting = settings[0];

  const featuresSection = document.querySelector("#features");
  if (!featuresSection) return;

  // Update background image
  const bgImage = featuresSection.querySelector(".features-image img");
  if (
    bgImage &&
    (setting.background_image_url_ar || setting.background_image_url)
  ) {
    bgImage.src =
      setting.background_image_url_ar || setting.background_image_url;
    bgImage.alt = "Features Background";
  }

  const featuresList = featuresSection.querySelector(".col-lg-6.order-lg-1");
  if (!featuresList || !features) return;

  // Sort features by order_number
  const sortedFeatures = [...features].sort(
    (a, b) => a.order_number - b.order_number
  );

  featuresList.innerHTML = sortedFeatures
    .map(
      (feature, index) => `
    <div class="features-item d-flex ps-0 ps-lg-3 ${
      index === 0 ? "pt-4 pt-lg-0" : "mt-5"
    }" data-aos="fade-up" data-aos-delay="200">
      <i class="${feature.icon} flex-shrink-0"></i>
      <div>
        <h4>${feature.title_ar || feature.title}</h4>
        <p>${feature.description_ar || feature.description}</p>
      </div>
    </div>
  `
    )
    .join("");
}

// Update stats section
function updateStats(settings) {
  if (!settings) return;

  const statsSection = document.querySelector("#stats");
  if (!statsSection) return;

  const bgImage = statsSection.querySelector("img");
  if (
    bgImage &&
    (settings.background_image_url_ar || settings.background_image_url)
  ) {
    bgImage.src =
      settings.background_image_url_ar || settings.background_image_url;
    bgImage.alt = settings.title_ar || settings.title || "";
  }

  // Update title and subtitle
  const title = statsSection.querySelector(".subheading h3");
  const subtitle = statsSection.querySelector(".subheading p");

  if (title) title.textContent = settings.title_ar || "ما حققناه حتى الآن";
  if (subtitle)
    subtitle.textContent =
      settings.subtitle_ar ||
      "في دليل إن، بنينا أساسًا قويًا من خلال ربط الشركات بالعملاء، وتعزيز المشاركة، وتحقيق النتائج.";

  const statsContainer = statsSection.querySelector(".row");
  if (!statsContainer) return;

  // First destroy existing PureCounter instances
  const existingCounters = document.querySelectorAll(".purecounter");
  existingCounters.forEach((counter) => {
    if (counter.dataset.purecounterInitialized) {
      delete counter.dataset.purecounterInitialized;
    }
  });

  // Create stats array from settings
  const statsData = [
    {
      number: settings.businesses,
      label: settings.businesses_label_ar || "عملاء سعداء",
    },
    {
      number: settings.campaigns,
      label: settings.campaigns_label_ar || "المشاريع",
    },
    {
      number: settings.support_hours,
      label: settings.support_hours_label_ar || "ساعات الدعم",
    },
    {
      number: settings.team_members,
      label: settings.team_members_label_ar || "العاملين",
    },
  ];

  statsContainer.innerHTML = statsData
    .map(
      (stat) => `
      <div class="col-lg-3 col-md-6">
        <div class="stats-item text-center w-100 h-100">
          <span data-purecounter-start="0" 
                data-purecounter-end="${parseInt(stat.number) || 0}" 
                data-purecounter-duration="1" 
                class="purecounter"></span>
          <p>${stat.label}</p>
        </div>
      </div>
    `
    )
    .join("");

  // Initialize new PureCounter
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }
}

// Update clients section
function updateClients(clients) {
  if (!clients || !clients.length) return;

  const clientsSection = document.querySelector("#clients .carousel-inner");
  if (!clientsSection) return;

  // Group clients into sets of 4
  const groupedClients = clients.reduce((acc, client, i) => {
    const groupIndex = Math.floor(i / 4);
    if (!acc[groupIndex]) acc[groupIndex] = [];
    acc[groupIndex].push(client);
    return acc;
  }, []);

  clientsSection.innerHTML = groupedClients
    .map(
      (group, index) => `
    <div class="carousel-item ${index === 0 ? "active" : ""}">
      <div class="row justify-content-center">
        ${group
          .map(
            (client) => `
          <div class="col-12 col-sm-3 col-md-3 col-lg-3 col-xl-3 client-logo">
            <img src="${client.logo_url}" class="img-fluid" alt="${client.name}">
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
    )
    .join("");
}

// Update FAQ section
function updateFAQ(settings, faqs) {
  if (!settings || !settings[0]) return;
  const setting = settings[0];

  const faqSection = document.querySelector("#faq");
  if (!faqSection) return;

  const title = faqSection.querySelector(".content h3");
  if (title) {
    title.innerHTML = `<span>${setting.title_ar || "الأسئلة"} </span><strong>${
      setting.subtitle_ar || "الشائعة"
    }</strong>`;
  }

  const image = faqSection.querySelector(".col-lg-5 img");
  if (image && (setting.image_url_ar || setting.image_url)) {
    image.src = setting.image_url_ar || setting.image_url;
    image.alt = "FAQ Section Image";
  }

  const faqContainer = faqSection.querySelector(".faq-container");
  if (!faqContainer || !faqs) return;

  // Sort FAQs by order_number if available
  const sortedFaqs = faqs.sort(
    (a, b) => (a.order_number || 0) - (b.order_number || 0)
  );

  // Default FAQs in case no data is available
  const defaultFaqs = [
    {
      question_ar: "كيف يعمل دليل إن؟",
      answer_ar:
        "يربط دليل إن الشركات بالعملاء بسلاسة. من البيع بالتجزئة والمطاعم إلى الخدمات الأساسية، يبسط تطبيقنا الاكتشاف والتفاعل، مما يؤدي إلى المزيد من حركة المرور والمشاركة عبر الإنترنت لعملك.",
    },
    {
      question_ar: "كيف أكسب وأستخدم المكافآت؟",
      answer_ar:
        "يكافئ دليل إن المستخدمين على كل تفاعل، من المشتريات إلى استخدام التطبيق. يمكن استبدال هذه النقاط مقابل خصومات أو عروض خاصة أو صفقات حصرية داخل التطبيق، مما يمنحك قيمة أكبر لمشترياتك.",
    },
    {
      question_ar: "ما هي فرص الإعلان التي يوفرها دليل إن؟",
      answer_ar:
        "يقدم دليل إن خيارات إعلانية متنوعة تناسب احتياجات عملك:<br>1-إعلانات البانر للظهور<br>2-إشعارات دفع للعروض محددة الوقت<br>3-عروض ترويجية مبنية على الموقع لجذب المستخدمين القريبين",
    },
  ];

  // Use database FAQs or fall back to defaults
  const faqsToUse = sortedFaqs.length > 0 ? sortedFaqs : defaultFaqs;

  faqContainer.innerHTML = faqsToUse
    .map(
      (faq, index) => `
    <div class="faq-item ${index === 0 ? "faq-active" : ""}">
      <i class="faq-icon bi bi-question-circle"></i>
      <h3>${faq.question_ar || faq.question}</h3>
      <div class="faq-content">
        <p>${faq.answer_ar || faq.answer}</p>
      </div>
      <i class="faq-toggle bi bi-chevron-right"></i>
    </div>
  `
    )
    .join("");

  // Add click handlers for FAQ items
  const faqItems = faqContainer.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const toggle = item.querySelector(".faq-toggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        faqItems.forEach((otherItem) => {
          if (
            otherItem !== item &&
            otherItem.classList.contains("faq-active")
          ) {
            otherItem.classList.remove("faq-active");
          }
        });
        item.classList.toggle("faq-active");
      });

      const question = item.querySelector("h3");
      if (question) {
        question.addEventListener("click", () => {
          toggle.click();
        });
      }
    }
  });
}

// Update rewards section
function updateRewards(settings, rewards) {
  const rewardsSection = document.querySelector("#recent-posts");
  if (!rewardsSection) return;

  // Update section title and description
  const title = rewardsSection.querySelector(".section-title h2");
  if (title) {
    title.textContent = settings?.[0]?.title_ar || "كيف أكسب واستخدم المكافآت";
  }

  const description = rewardsSection.querySelector(".section-title p");
  if (description) {
    description.textContent =
      settings?.[0]?.description_ar ||
      "يكافئ دليل إن المستخدمين على كل تفاعل، من المشتريات إلى استخدام التطبيق. يمكن استبدال هذه النقاط بخصومات أو عروض خاصة أو صفقات حصرية داخل التطبيق، مما يمنحك قيمة أكبر لمشترياتك.";
  }

  const rewardsContainer = rewardsSection.querySelector(".row");
  if (!rewardsContainer || !rewards) return;

  // Sort rewards by order_number
  const sortedRewards = [...rewards].sort(
    (a, b) => (a.order_number || 0) - (b.order_number || 0)
  );

  // Default rewards if none available
  const defaultRewards = [
    {
      title_ar: "ميزة قائمة الرغبات",
      category_ar: "قائمة شخصية من المنتجات",
      description_ar:
        "قائمة شخصية من المنتجات أو الخدمات التي يرغبون فيها، مع إطار زمني للوصول إلى هدفهم. يمكن للمستخدمين الاقتراب من العناصر المرغوبة مع كسب المزايا للإنفاق اليومي.",
      image_url_ar: "assets/img/blog/blog-1-ar.jpg",
    },
    {
      title_ar: "التلعيب",
      category_ar: "جعل تجربة التسوق أكثر جاذبية ومتعة",
      description_ar:
        "تحقيق الإنجازات من خلال استخدام التطبيق والمشتريات. يحافظ هذا النهج التفاعلي على تحفيز المستخدمين للتفاعل أكثر مع المنصة وكسب مكافآت قيمة.",
      image_url_ar: "assets/img/blog/blog-2-ar.jpg",
    },
    {
      title_ar: "اعثر على كل شيء",
      category_ar: "اكتشف الخدمات المختلفة",
      description_ar:
        "سواء كانوا يبحثون عن الطعام أو الخدمات الصحية أو خيارات السفر، توفر هذه الميزة تجربة بحث سهلة، مما يساعد المستخدمين على العثور بسرعة على ما يحتاجون إليه واكتشاف شركات جديدة لاستكشافها.",
      image_url_ar: "assets/img/blog/blog-3-ar.jpg",
    },
  ];

  const rewardsToShow = rewards?.length ? sortedRewards : defaultRewards;

  rewardsContainer.innerHTML = rewardsToShow
    .map(
      (reward) => `
    <div class="col-xl-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
      <article>
        <div class="post-img">
          <img src="${reward.image_url_ar || ""}" alt="${
        reward.title_ar || ""
      }" class="img-fluid">
        </div>
        <p class="post-category">${reward.category_ar || ""}</p>
        <h2 class="title">
          <a href="#">${reward.title_ar || ""}</a>
        </h2>
        <div class="d-flex align-items-center">
          <div class="post-meta">
            <p class="post-description">${reward.description_ar || ""}</p>
          </div>
        </div>
      </article>
    </div>
  `
    )
    .join("");

  // Initialize AOS
  if (typeof AOS !== "undefined") {
    AOS.refresh();
  }
}

// Update contact section
function updateContact(data) {
  if (!data || !data[0]) return;
  const contact = data[0];

  const contactSection = document.querySelector("#contact");
  if (!contactSection) return;

  const title = contactSection.querySelector(".section-title h2");
  if (title) title.textContent = contact.title_ar || "تواصل معنا";

  const description = contactSection.querySelector(".section-title p");
  if (description)
    description.textContent =
      contact.description_ar || "نحن هنا للإجابة على استفساراتك";

  // Update contact info items
  const address = contactSection.querySelector(
    ".info-item.d-flex:nth-child(1)"
  );
  if (address) {
    address.querySelector("h3").textContent =
      contact.address_label_ar || "العنوان";
    address.querySelector("p").textContent =
      contact.address_ar ||
      contact.address ||
      "مجمع دسمان، مدينة الكويت، الكويت";
  }

  const phone = contactSection.querySelector(".info-item.d-flex:nth-child(2)");
  if (phone) {
    phone.querySelector("h3").textContent =
      contact.phone_label_ar || "اتصل بنا";
    phone.querySelector("p").textContent =
      contact.phone || "(+965) 90997122 / (+965) 22207122";
  }

  const email = contactSection.querySelector(".info-item.d-flex:nth-child(3)");
  if (email) {
    email.querySelector("h3").textContent =
      contact.email_label_ar || "البريد الإلكتروني";
    email.querySelector("p").textContent = contact.email || "info@dalilin.com";
  }
}

// Update navigation settings
function updateNavigationSettings(settings) {
  if (!settings) return;

  const logo = document.querySelector(".logo img");
  if (logo) {
    logo.src =
      settings.logo_url_ar || settings.logo_url || "./assets/img/logo.png";
  }

  const ctaBtn = document.querySelector("header .cta-btn");
  if (ctaBtn) {
    ctaBtn.textContent =
      settings.cta_text_ar || settings.cta_text || "ابدأ الآن";
    ctaBtn.href = settings.cta_link || "#about";
  }
}

// Update navbar
function updateNavbar(navItems) {
  if (!navItems || !navItems.length) return;

  const navList = document.querySelector("#navmenu ul");
  if (!navList) return;

  // Sort items by order_index
  const sortedItems = [...navItems].sort(
    (a, b) => a.order_index - b.order_index
  );

  // Get the existing language switch item
  const languageSwitch =
    navList.querySelector(".language-switch").parentElement.outerHTML;

  // Add new items before the language switch
  const menuItems = sortedItems
    .map(
      (item) =>
        `<li><a href="${item.link}" ${
          item.link === "#hero" ? 'class="active"' : ""
        }>${item.name_ar || item.name}</a></li>`
    )
    .join("");

  navList.innerHTML = menuItems + languageSwitch;
}

// Set up real-time subscriptions
const tables = [
  "navigation_menu_items",
  "navigation_settings",
  "hero_settings",
  "about_settings",
  "services_settings",
  "services",
  "cta_settings",
  "features_settings",
  "features",
  "clients_items",
  "stats_settings",
  "faq_settings",
  "faq_items",
  "rewards_settings",
  "rewards_items",
  "contact_settings",
];

const channel = supabaseClient.channel("table_changes");

tables.forEach((table) => {
  channel.on(
    "postgres_changes",
    { event: "*", schema: "public", table: table },
    async (payload) => {
      console.log(`${table} update:`, payload);
      const data = await fetchData(table);

      switch (table) {
        case "navigation_menu_items":
          if (data) updateNavbar(data);
          break;
        case "navigation_settings":
          if (data) updateNavigationSettings(data[0]);
          break;
        case "hero_settings":
          if (data) updateHero(data);
          break;
        case "about_settings":
          if (data) updateAbout(data);
          break;
        case "services":
        case "services_settings":
          const [settings, services] = await Promise.all([
            fetchData("services_settings"),
            fetchData("services"),
          ]);
          if (settings && services) updateServices(settings, services);
          break;
        case "cta_settings":
          if (data) updateCTA(data);
          break;
        case "features":
        case "features_settings":
          const [fSettings, features] = await Promise.all([
            fetchData("features_settings"),
            fetchData("features"),
          ]);
          if (fSettings && features) updateFeatures(fSettings, features);
          break;
        case "clients_items":
          if (data) updateClients(data);
          break;
        case "stats_settings":
          if (data) updateStats(data[0]);
          break;
        case "faq_items":
        case "faq_settings":
          const [faqSettings, faqs] = await Promise.all([
            fetchData("faq_settings"),
            fetchData("faq_items"),
          ]);
          if (faqSettings && faqs) updateFAQ(faqSettings, faqs);
          break;
        case "rewards_items":
        case "rewards_settings":
          const [rSettings, rewards] = await Promise.all([
            fetchData("rewards_settings"),
            fetchData("rewards_items"),
          ]);
          if (rSettings && rewards) updateRewards(rSettings, rewards);
          break;
        case "contact_settings":
          if (data) updateContact(data);
          break;
      }
    }
  );
});

channel.subscribe();

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  showLoader();
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease-in";
  initializeData();
});
