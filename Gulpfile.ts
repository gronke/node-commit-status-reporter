/// <reference types="node" />

const map = require('map-stream');
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const plugins = gulpLoadPlugins();

import { GitHubRepository, Statuses, StatusOptions } from './index';
const githubRepository = new GitHubRepository(
  'gronke',
  'node-commit-status-reporter',
  plugins.util.env.GITHUB_TOKEN
);
const commit = githubRepository.commit(plugins.util.env.COMMIT);

gulp.task('compile:typescript', () => {
  return gulp.src('index.ts')
  .pipe(plugins.typescript.createProject('tsconfig.json')())
  .pipe(gulp.dest('.'));
});

gulp.task('tslint', () => {

  const status = commit.getStatus('tslint');
  return status.report(Statuses.pending)
    .then(() => {
      return new Promise((resolve) => {
        let errorCount = 0;
        return gulp.src([
          './index.ts'
        ])
        .pipe(plugins.tslint({
          configuration: 'tslint.json',
          formatter: 'prose'
        }))
        .pipe(map((file: { tslint: { errorCount: number }}, done: (err: Error | null, file: {}) => void) => {
          errorCount += file.tslint.errorCount;
          done(null, file);
        }))
        .pipe(plugins.tslint.report({
          emitError: false
        }))
        .on('end', () => {
          resolve(errorCount)
        });
      });
     })
    .then((errorCount) => {
      const hasErrors = (errorCount > 0);
      const state = hasErrors ? Statuses.failure : Statuses.success;
      const description = hasErrors ? `failed with ${errorCount} errors` : '';
      return status.report(state, description);
    });

});

gulp.task('build', ['compile:typescript']);

gulp.task('travis', ['tslint', 'build']);
