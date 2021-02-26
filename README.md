[![Build Status](https://travis-ci.com/mateodelnorte/meta-git.svg?branch=master)](https://travis-ci.com/mateodelnorte/meta-git)

# meta-git

Manage your meta repo and child git repositories.

git plugin for [meta](https://github.com/mateodelnorte/meta)

## Usage

```
➜  meta git

  Usage: meta-git [options] [command]


  Commands:

    branch      List, create, or delete branches
    checkout    Switch branches or restore working tree files
    clean       Remove untracked files from the working tree
    clone       Clone meta and child repositories into new directories
    pull        Fetch from and integrate with another repository or a local branch
    push        Update remote refs along with associated objects
    remote      Manage set of tracked repositories
    status      Show the working tree status
    tag         Create, list, delete or verify a tag object signed with GPG
    update      Clone any repos that exist in your .meta file but aren't cloned locally
    help [cmd]  display help for [cmd]

  Options:

    -h, --help  output usage information
```

#### meta git clone

Clones a meta repository and it's child repositories.

```
meta git clone <repo>
```

#### meta git update

Clones any child repositories from the `.meta` file that are missing.

```
meta git clone <repo>
```

#### meta git status

Track your progress on all branches at once:

```
meta git status
```

 [![asciicast](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k.png)](https://asciinema.org/a/83lg1tvqz9gwynixq5nhwsm2k)

#### meta git branch

View what branches exist on all your repos:

```
meta git branch
```

 [![asciicast](https://asciinema.org/a/5nt6i1dwm73igxtjgzifyqi2y.png)](https://asciinema.org/a/5nt6i1dwm73igxtjgzifyqi2y)
 
#### meta git checkout

Create new branches on all your repos at once:

```
meta git checkout -b [branch-name]
```

Check out an existing branch in all projects:

```
meta git checkout main
```

Revert all modified files to their remote status:

```
meta git checkout .
```

 [![asciicast](https://asciinema.org/a/amhfxkwax50ef4ic4g1vqyifp.png)](https://asciinema.org/a/amhfxkwax50ef4ic4g1vqyifp)
 
#### meta git clean

Remove unwanted untracked files on all repos:

```
meta git clean -fd
```

 [![asciicast](https://asciinema.org/a/0s8f9wp49nfilzpub3tnf9shg.png)](https://asciinema.org/a/0s8f9wp49nfilzpub3tnf9shg)