import { LoadAllPosts } from '@/domain/usecases'
import { LoadAllPostsRepository } from '@/data/protocols'
import { PostModel } from '@/domain/models'

export class DbLoadAllPosts implements LoadAllPosts {
  constructor (private readonly loadAllPostsRepository: LoadAllPostsRepository) { }

  async load (params: LoadAllPosts.Params): Promise<LoadAllPosts.Result> {
    const { loadFilterOptions, ...repoParams } = params
    const loadResult = await this.loadAllPostsRepository.loadAll(repoParams)
    const posts: PostModel[] = loadResult.result
    const res: LoadAllPosts.Result = { posts: loadResult.result, count: loadResult.count }
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
      res.filterOptions = filterOptions
    }
    return res
  }
}
