import { ConsumetAnimePage } from "@/types/consumet";
import { SiteAnime, SiteEpisode } from "@/types/site";

export interface ExtendedAnimePage extends ConsumetAnimePage {
  totalPages: number;
}

export const getTrendingAnime = async (page = 1, perPage = 24) => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [TRENDING_DESC, POPULARITY_DESC], $type: MediaType) {
        Page(page: $page, perPage: $size) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            id
            idMal
            status(version: 2)
            title {
              userPreferred
              romaji
              english
              native
            }
            genres
            trailer {
              id
              site
              thumbnail
            }
            description
            format
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            meanScore
            duration
            season
            seasonYear
            averageScore
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            type
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
          }
        }
      }      
      `;

  const variables = {
    isAdult: false,
    page: page,
    size: perPage,
    type: 'ANIME',
  };

  let response;

  try {
    response = await (
      await fetch(`https://graphql.anilist.co`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      })
    ).json();

    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      totalPages: response.data.Page.pageInfo.total,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          image:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: {
            id: item.trailer?.id,
            site: item.trailer?.site,
            thumbnail: item.trailer?.thumbnail,
          },
          description: item.description,
          status: item.status,
          cover:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          type: item.format,
        })),
    };

    return res as ExtendedAnimePage;
  } catch (error) {
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_CONSUMET_API}/trending?perPage=${perPage}&page=${page}`,
      );
      return (await response.json()) as ExtendedAnimePage;
    } catch (error) {
      console.error(error);
    }
  }
};

export const getPopularAnime = async (page = 1, perPage = 24) => {
  const query = `query ($page: Int, $isAdult: Boolean = false, $size: Int, $sort: [MediaSort] = [POPULARITY_DESC], $type: MediaType) {
        Page(page: $page, perPage: $size) {
          pageInfo {
            total
            perPage
            currentPage
            lastPage
            hasNextPage
          }
          media(isAdult: $isAdult, sort: $sort, type: $type) {
            id
            idMal
            status(version: 2)
            title {
              userPreferred
              romaji
              english
              native
            }
            genres
            trailer {
              id
              site
              thumbnail
            }
            description
            format
            bannerImage
            coverImage {
              extraLarge
              large
              medium
              color
            }
            episodes
            meanScore
            duration
            season
            seasonYear
            averageScore
            nextAiringEpisode {
              airingAt
              timeUntilAiring
              episode
            }
            type
            startDate {
              year
              month
              day
            }
            endDate {
              year
              month
              day
            }
          }
        }
      }      
            `;

  const variables = {
    isAdult: false,
    page: page,
    size: perPage,
    type: 'ANIME',
  };

  let response;

  try {
    response = await (
      await fetch(`https://graphql.anilist.co`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      })
    ).json();

    const res: any = {
      currentPage: response.data.Page.pageInfo.currentPage,
      totalPages: response.data.Page.pageInfo.total,
      hasNextPage: response.data.Page.pageInfo.hasNextPage,
      results: response.data.Page.media
        .filter((item: any) => item.status !== 'NOT_YET_RELEASED')
        .map((item: any) => ({
          id: item.id.toString(),
          malId: item.idMal,
          title:
            {
              romaji: item.title.romaji,
              english: item.title.english,
              native: item.title.native,
              userPreferred: item.title.userPreferred,
            } || item.title.romaji,
          image:
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          trailer: {
            id: item.trailer?.id,
            site: item.trailer?.site,
            thumbnail: item.trailer?.thumbnail,
          },
          description: item.description,
          status: item.status,
          cover:
            item.bannerImage ??
            item.coverImage.extraLarge ??
            item.coverImage.large ??
            item.coverImage.medium,
          rating: item.averageScore,
          meanScore: item.meanScore,
          releaseDate: item.seasonYear,
          color: item.coverImage?.color,
          genres: item.genres,
          totalEpisodes: isNaN(item.episodes)
            ? 0
            : item.episodes ?? item.nextAiringEpisode?.episode - 1 ?? 0,
          duration: item.duration,
          type: item.format,
        })),
    };

    return res as ExtendedAnimePage;
  } catch (error) {
    try {
      response = await fetch(
        `${process.env.NEXT_PUBLIC_CONSUMET_API}/popular?perPage=${perPage}&page=${page}`,
      );
      return (await response.json()) as ExtendedAnimePage;
    } catch (error) {
      console.error(error);
    }
  }
};

export async function getEpisodes(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/v1/episodes/${id}`,
    );
    let episodes: SiteEpisode[] | undefined;

    try {
      episodes = ((await response.json()) as SiteAnime[]).find(
        (p) => p.providerId === 'anizone',
      )?.episodes;
    } catch (error) {
      episodes = [];
    }
    return episodes;
  } catch (error) {
    console.error(error);
  }
}

export async function getSkipTimes(malId: string, episodeNumber: number) {
  const skipResponse = await fetch(
    `https://api.aniskip.com/v2/skip-times/${malId}/${Number(
      episodeNumber,
    )}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`,
  );

  const skipData = await skipResponse.json();
  const op =
    skipData?.results?.find((item: any) => item.skipType === 'op') || null;
  const ed =
    skipData?.results?.find((item: any) => item.skipType === 'ed') || null;
  const episodeLength =
    skipData?.results?.find((item: any) => item.episodeLength)?.episodeLength ||
    0;

  const skiptime: any[] = [];

  if (op?.interval) {
    skiptime.push({
      startTime: op.interval.startTime ?? 0,
      endTime: op.interval.endTime ?? 0,
      text: 'Opening',
    });
  }
  if (ed?.interval) {
    skiptime.push({
      startTime: ed.interval.startTime ?? 0,
      endTime: ed.interval.endTime ?? 0,
      text: 'Ending',
    });
  } else {
    skiptime.push({
      startTime: op?.interval?.endTime ?? 0,
      endTime: episodeLength,
      text: '',
    });
  }
}