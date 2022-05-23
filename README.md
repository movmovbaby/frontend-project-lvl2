# Difference generator

[![Actions Status](https://github.com/movmovbaby/frontend-project-lvl2/workflows/hexlet-check/badge.svg)](https://github.com/movmovbaby/frontend-project-lvl2/actions)
<a href="https://codeclimate.com/github/codeclimate/codeclimate/maintainability"><img src="https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability" /></a>
<a href="https://codeclimate.com/github/movmovbaby/frontend-project-lvl2/test_coverage"><img src="https://api.codeclimate.com/v1/badges/fa25d37870758fd0ffb5/test_coverage" /></a>
![example workflow](https://github.com/movmovbaby/frontend-project-lvl2/actions/workflows/project-lint.yml/badge.svg)

## What is it?

Simple CLI tool for comparing json and yaml files with 3 format of output.

### Installation

* Install Node.js
* Clone [this](https://github.com/movmovbaby/frontend-project-lvl2.git) repository
* Run this commands from cloned directory:

``` bash
make install
make publish
```

### Usage

```bash
gendiff --format [output type] <pathToFile1> <pathToFile2>
```

#### Formats of output

1. stylish (by default) - gendiff file1.json file2.json
2. plain - gendiff --format plain file1.json file2.json
3. json - gendif --format json file1.json file2.json

#### ASCIINEMAs with examples of work

1. Stylish formatter
[![asciicast](https://asciinema.org/a/bVcGN00QG0cgrUBRPJHnmPh1G.svg)](https://asciinema.org/a/bVcGN00QG0cgrUBRPJHnmPh1G)

2. Plain formatter
[![asciicast](https://asciinema.org/a/0uVGjZMVy3zYoRQrt927M0qew.svg)](https://asciinema.org/a/0uVGjZMVy3zYoRQrt927M0qew)

3. Json formatter
[![asciicast](https://asciinema.org/a/qT3Dmv671viAUqSWZswpMitxs.svg)](https://asciinema.org/a/qT3Dmv671viAUqSWZswpMitxs)
