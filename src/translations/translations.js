export const translations = {
  en: {
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      contact: 'Contact Us',
    },
    hero: {
      cta: 'View More',
    },
    recommended: {
      title: 'You might like these too',
    },
    catalog: {
      header: 'Shop Our Brands',
    },
    product: {
      features: 'Product Features',
      skinType: 'Skin Type',
      ingredients: 'Main Ingredients',
      howToUse: 'How to Use',
      content: 'Content',
    },
    vision: {
      title: 'Our Vision',
      part1: 'With over 13 years of trusted expertise since 2012, Beaute Ethical Supplies has become a go-to distributor of Korean professional salon-grade skincare, serving both beauty professionals and discerning skincare enthusiasts.',
      part2: 'Rooted in quality, ethical sourcing, and innovation, our carefully curated products deliver results that speak for themselves, because your clients deserve nothing less than professional excellence.',
    },
    contact: {
      title: 'Contact Us',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
    },
  },
  zh: {
    nav: {
      home: '首页',
      catalog: '产品目录',
      contact: '联系我们',
    },
    hero: {
      cta: '查看更多',
    },
    recommended: {
      title: '你可能还喜欢',
    },
    catalog: {
      header: '选购我们的品牌',
    },
    product: {
      features: '产品特点',
      skinType: '适用肤质',
      ingredients: '主要成分',
      howToUse: '使用方法',
      content: '规格',
    },
    vision: {
      title: '我们的愿景',
      part1: '自2012年以来，Beaute Ethical Supplies 凭借超过13年的值得信赖经验，已成为韩国专业沙龙级护肤品的首选经销商，服务于美容专业人士和讲究护肤品质的消费者。',
      part2: '我们立足于品质、道德采购和创新，精心甄选的产品以卓越效果证明自身价值，因为您的客户值得拥有真正专业级的卓越体验。',
    },
    contact: {
      title: '联系我们',
      email: '电子邮箱',
      phone: '电话',
      address: '地址',
    },
  },
}

// Resolves dot-notation key like "nav.home" through nested object traversal
export function t(translationsObj, lang, key) {
  const parts = key.split('.')
  let val = translationsObj[lang]
  for (const part of parts) {
    val = val?.[part]
  }
  if (val !== undefined) return val
  // fallback to english
  let fallback = translationsObj['en']
  for (const part of parts) {
    fallback = fallback?.[part]
  }
  return fallback ?? key
}
