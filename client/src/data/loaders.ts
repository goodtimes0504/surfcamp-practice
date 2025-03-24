import { getStrapiUrl } from '../utils/get-strapi-url'
import { fetchAPI } from '@/utils/fetch-api'
import qs from 'qs'
// 获取Strapi CMS基础URL
const BASE_URL = getStrapiUrl()

/**
 * 首页查询参数配置
 * 使用qs库构建复杂的查询字符串，定义了需要获取的数据结构
 * 这个查询配置指定了需要从Strapi CMS获取的首页块内容及其关联数据
 */
const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        // 英雄区块的数据获取配置
        'blocks.hero-section': {
          populate: {
            // 获取图片资源及其URL和替代文本
            image: {
              fields: ['url', 'alternativeText'],
            },
            // 获取Logo及其关联图片
            logo: {
              populate: {
                image: {
                  fields: ['url', 'alternativeText'],
                },
              },
            },
            // 获取号召性用语(Call to Action)
            cta: true,
          },
        },
        // 信息块的数据获取配置
        'blocks.info-block': {
          populate: {
            // 获取图片资源
            image: {
              fields: ['url', 'alternativeText'],
            },
            // 获取号召性用语
            cta: true,
          },
        },
      },
    },
  },
})

/**
 * 获取首页数据的异步函数
 * 通过构建完整的API URL并添加查询参数来向Strapi CMS请求数据
 *
 * @returns {Promise<any>} 返回包含首页数据的Promise对象
 */
export async function getHomePage() {
  // 定义API路径
  const path = '/api/home-page'

  // 创建完整的URL对象
  const url = new URL(path, BASE_URL)
  // 添加查询参数
  url.search = homePageQuery

  // 发送GET请求获取数据并返回结果
  return await fetchAPI(url.href, { method: 'GET' })
}
/**
 * 关于 url.search：
在 URL 对象中，search 属性表示 URL 的查询字符串部分，即 ? 后面的内容
设置 url.search 等于 homePageQuery 就是将格式化后的查询字符串附加到 URL 上
最终会生成形如 /api/home-page?populate[blocks][on]... 这样的 URL
做了以下工作：
homePageQuery 已经被 qs.stringify() 转换为查询字符串
将这个查询字符串赋值给 url.search
这样构建完整的 URL，例如从 /api/home-page 变成 /api/home-page?populate[blocks]...
这种方式使得 API 请求 URL 包含了所有必要的查询参数，告诉 Strapi CMS 需要返回哪些数据以及如何组织这些数据。
在发送请求时，url.href 会包含完整的 URL（基础URL + 路径 + 查询参数），确保 API 接收到准确的数据获取指令。
 */

const pageBySlugQuery = (slug: string) =>
  qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    populate: {
      blocks: {
        on: {
          'blocks.hero-section': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
              logo: {
                populate: {
                  image: {
                    fields: ['url', 'alternativeText'],
                  },
                },
              },
              cta: true,
            },
          },
          'blocks.info-block': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
              cta: true,
            },
          },
          'blocks.featured-article': {
            populate: {
              image: {
                fields: ['url', 'alternativeText'],
              },
              link: true,
            },
          },
          'blocks.subscribe': {
            populate: true,
          },
        },
      },
    },
  })

export async function getPageBySlug(slug: string) {
  const path = '/api/pages'
  const url = new URL(path, BASE_URL)
  url.search = pageBySlugQuery(slug)
  return await fetchAPI(url.href, { method: 'GET' })
}

const globalSettingQuery = qs.stringify({
  populate: {
    header: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ['url', 'alternativeText'],
            },
          },
        },
        navigation: true,
        cta: true,
      },
    },
    footer: {
      populate: {
        logo: {
          populate: {
            image: {
              fields: ['url', 'alternativeText'],
            },
          },
        },
        navigation: true,
        policies: true,
      },
    },
  },
})

export async function getGlobalSettings() {
  const path = '/api/global'
  const url = new URL(path, BASE_URL)
  url.search = globalSettingQuery
  return await fetchAPI(url.href, { method: 'GET' })
}
