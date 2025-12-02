module.exports = {
  apps: [
    {
      name: 'tubiao-index',
      script: './app.js',
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      instance_var: 'INSTANCE_ID',
      error_file: '/dev/null',
      out_file: '/dev/null',
    },
  ],
};
