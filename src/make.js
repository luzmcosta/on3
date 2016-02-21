import transformer from './transformer';

transformer.exec('src/cli.js', 'bin/cli.js', 'cli');
transformer.exec('src/cli.js', 'build/cli.js', 'node:app');
