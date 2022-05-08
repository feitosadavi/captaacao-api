import { LoadAllPosts } from '@/domain/usecases'
import { LoadAllPostsRepository } from '@/data/protocols'

export class DbLoadAllPosts implements LoadAllPosts {
  constructor (private readonly loadAllPostsRepository: LoadAllPostsRepository) { }

  async load (params: LoadAllPosts.Params): Promise<LoadAllPosts.Result> {
    const { loadFilterOptions, ...repoParams } = params
    const posts = await this.loadAllPostsRepository.loadAll(repoParams)
    let res: LoadAllPosts.Result = { posts }
    if (params.loadFilterOptions) {
      const filterNames: Array<'brand' | 'model' | 'fuel' | 'year' | 'color' | 'steering' | 'doors'> = [
        'brand',
        'model',
        'fuel',
        'year',
        'color',
        'steering',
        'doors'
      ]
      const filterOptions: any = {}
      for (const filterName of filterNames) {
        filterOptions[filterName] = []
        for (const post of posts) {
          if (!filterOptions[filterName]?.includes(post.carBeingSold[filterName])) {
            filterOptions[filterName].push(post.carBeingSold[filterName])
          }
        }
      }
      res = { posts, filterOptions }
    }
    return res
  }
}
