
// TODO: make these paths configurable
var kInDirectory = '/Users/volkan/Dropbox/enchantress/in/',
    kOutDirectory = '/Users/volkan/Dropbox/enchantress/out/',

    lock = {},

    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec;

fs.watch(kInDirectory, {persistent: true}, function(event, fileName) {
    fs.readdir(kInDirectory, function(err, files) {
        files.forEach(function(file) {
            fs.readFile(path.join(kInDirectory, file), {encoding: 'utf8'}, function(err, data) {
                if(path.extname(file) === '.sh' && !lock[file]) {
                    lock[file] = true;

                    exec(data, function (error, stdout, stderr) {
                        var buffer = [];

                        if (stdout) {
                            buffer.push('\nstdout:\n');
                            buffer.push(stdout);
                            buffer.push('\n---\n');
                        }

                        if (stderr) {
                            buffer.push('\nstderr:\n');
                            buffer.push(stderr);
                            buffer.push('\n---\n');
                        }

                        if (err) {
                            buffer.push('\nexecerr:\n');
                            buffer.push(stderr);
                            buffer.push('\n---\n');
                        }

                        fs.writeFile(path.join(kOutDirectory, file), buffer.join(''), {encoding: 'utf8'}, function() {
                            fs.unlink(path.join(kInDirectory, file), function() {
                               lock[file] = false;
                            });
                        });
                    });
                }
            });
        });
    });
});

console.log('in : ' + kInDirectory);
console.log('out: ' + kOutDirectory);
console.log('Enchantress is ready...');