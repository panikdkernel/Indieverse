import { GraphQLObjectType,
         GraphQLString,
         GraphQLSchema,
         GraphQLList,
        GraphQLNonNull,
        GraphQLID} from 'graphql';
import GraphQLDate from 'graphql-date';
import { UserType, AlbumType, MusicType } from './types';
import { User, Album, Music } from '../mongooes/connect';

const query = new GraphQLObjectType({
    name: 'query',
    fields: () => ({
        hello: {
            type: GraphQLString,
            args: {},
            resolve(parentVal, args) {
                return "Hello World";
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentVal, args) {
                return User.find();
            }
        },
        user: {
            type: UserType,
            args: {
                userId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parentVal, args) {
                return User.findById(args.userId)
            }
        },
        userByOtherParams: {
            type: new GraphQLList(UserType),
            args: {
                username: {
                    type: GraphQLString
                },
                email: {
                    type: GraphQLString
                }
            },
            resolve(parentVal, args) {
                return User.find(args)
            }
        },
        albums: {
            type: new GraphQLList(AlbumType),
            args: {
                title: {
                    type: GraphQLString
                }
            },
            resolve(parentVal, args) {
                if (args.hasOwnProperty('title')) {
                    return Album.find({
                        title: { $regex: new RegExp(args.title, "i") }
                    });
                }
                return Album.find();
            }
        },
        album: {
            type: AlbumType,
            args: {
                albumId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parentVal, args) {
                return Album.findById(args.albumId)
            }
        },
        musics: {
            type: new GraphQLList(MusicType),
            args: {
                genre: {
                    type: GraphQLString
                },
                title: {
                    type: GraphQLString
                }
            },
            resolve(parentVal, args) {
                if (args.hasOwnProperty('title')) {
                    console.log('gg');
                    return Music.find({
                        title: { $regex: new RegExp(args.title, "i") }
                    })
                }
                return Music.find(args);
            }
        },
        music: {
            type: MusicType,
            args: {
                musicId: {
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parentVal, args) {
                return Music.findById(args.musicId)
            }
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            args: {
                firstname: {type: new GraphQLNonNull(GraphQLString) },
                lastname: {type: new GraphQLNonNull(GraphQLString) },
                email: {type: new GraphQLNonNull(GraphQLString) },
                username: {type: new GraphQLNonNull(GraphQLString) },
                password: {type: new GraphQLNonNull(GraphQLString) },
                profileImage: {type: GraphQLString },
                coverImage: {type: GraphQLString },
                descripion: {type: GraphQLString }
            },
            resolve(parentVal, args) {
                let user = new User(args);
                return user.save();
            }
        },
        addAlbum: {
            type: AlbumType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString) },
                descripion: {type: GraphQLString },
                date: {type: GraphQLDate},
                albumArt: {type: GraphQLString },
                artistId: {type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentVal, args) {
                let user;
                let albumObj = Object.assign({}, args);
                delete albumObj.artistId
                let album = new Album(albumObj)
                console.log(args);

                return User.findById(args.artistId)
                            .then((user) => {
                                if(!user)
                                    return Promise.reject('User not found');
                                return user.addAlbum(album);
                            }).catch((err) => {
                                throw new Error(err);
                            });
            }
        }, 
        addMusic: {
            type: MusicType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString) },
                genre: {type: new GraphQLNonNull(GraphQLString) },
                date: {type: GraphQLDate},
                streamUrl: {type: new GraphQLNonNull(GraphQLString) },
                albumId: {type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentVal, args) {
                let musicObj = Object.assign({}, args);
                delete musicObj.albumId;

                let music = new Music(musicObj);
                return Album.findById(args.albumId)
                            .then((album) => {
                                if(!album) {
                                    return Promise.reject('Album not found');
                                }
                                return album.addMusic(music);
                            }).catch((err) => {
                                throw new Error(err);
                            })
            }
        }
    })
})

export const schema = new GraphQLSchema({
    query,
    mutation
})