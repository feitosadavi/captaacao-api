/* eslint-disable space-before-function-paren */
import { LoadAllPosts } from '@/domain/usecases'
import { LoadAllPostsRepository, LoadRawFilterOptions } from '@/data/protocols'

export class DbLoadAllPosts implements LoadAllPosts {
  constructor(
    private readonly loadAllPostsRepository: LoadAllPostsRepository,
    private readonly loadRawFilterOptions: LoadRawFilterOptions
  ) { }

  async load (params: LoadAllPosts.Params): Promise<LoadAllPosts.Result> {
    const { loadFilterOptions, ...repoParams } = params
    const loadResult = await this.loadAllPostsRepository.loadAll(repoParams)
    const res: LoadAllPosts.Result = { posts: loadResult.result, count: loadResult.count }
    if (params.loadFilterOptions) {
      const filterOptions = await this.loadRawFilterOptions.loadRaw()
      res.filterOptions = filterOptions
    }
    return res
  }
}
