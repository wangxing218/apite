<template>
  <div class="container">
    <div class="side">
      <h2 class="logo">APITE DOC</h2>
      <ul class="nav">
        <li v-for="item in data" :key="item.file">
          <div class="title" :class="{close: item.close}" @click="item.close = !item.close">{{ item.name }}</div>
          <ul class="nav">
            <li v-for="item in item.routes" :key="getMark(item)" @click="scrollTo(item)">
              {{ item.doc.name }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="main">
      <div class="doc">
        <!-- doc info -->
        <h1 class="doc-title" v-if="info.title">{{ info.title }}</h1>
        <div class="doc-desc" v-if="info.desc" v-html="toHtml(info.desc)"></div>

        <!-- file mod -->
        <div class="mod" v-for="item in data" :key="data.file">
          <h2 class="mod-title">{{ item.name }}</h2>
          <div class="mod-desc" v-if="item.description" v-html="toHtml(item.description)"></div>

          <!-- api item -->
          <div
            class="api"
            v-for="item in item.routes"
            :key="item.method + item.url"
          >
            <h3 class="api-name" :id="getMark(item)">{{ item.doc.name }}</h3>
            <div
              class="api-desc"
              v-if="item.doc.description"
              v-html="toHtml(item.doc.description)"
            ></div>
            <div class="api-url">
              <span class="mark">接口</span>{{ item.url }}
            </div>
            <div class="api-method">
              <span class="mark">类型</span>{{ item.method }}
            </div>
            <div class="api-params" v-if="item.doc.params">
              <table class="table">
                <thead>
                  <tr>
                    <th>参数</th>
                    <th>说明</th>
                    <th>类型</th>
                    <th class="text-center">必填</th>
                    <th>默认值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in item.doc.params" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td>{{ item.desc }}</td>
                    <td>{{ item.type }}</td>
                    <td class="text-center">
                      {{ item.required ? '是' : '-' }}
                    </td>
                    <td>{{ item.default }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  max-width: 1000px;
  height: 100%;
  width: 100%;
}
.side {
  user-select: none;
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  width: 200px;
  padding: 0 15px 30px;
  z-index: 3;
  box-shadow: 6px 0 10px #eee;
}
.logo {
  font-size: 28px;
  padding: 10px 0;
  color: #4fc08d;
}
.nav {
  line-height: 28px;
  font-size: 14px;
  > li li {
    cursor: pointer;
    color: #455a64;
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      color: #4fc08d;
    }
  }

  .title {
    font-size: 15px;
    font-weight: 600;
    padding-top: 10px;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    text-overflow: ellipsis;
    color: #333;
    transition: color 0.2s;
    &:hover{
      color: #4fc08d;
    }
    + .nav {
      display: block;
    }
    &.close + .nav {
      display: none;
    }
  }
}
.main {
  margin-left: 200px;
  padding: 0 20px 30px;
}

.doc-title {
  font-size: 28px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  margin-bottom: 10px;
}
.doc-desc {
  padding: 5px 0;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #555;
  border-left: 5px solid #ccc;
  padding-left: 15px;
  > p {
    margin-bottom: 5px;
  }
}
.mod {
  padding: 10px 0;
}
.mod-title {
  font-size: 20px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  margin-bottom: 10px;
}
.mod-desc {
  padding: 5px 0;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #555;
  border-left: 5px solid #ccc;
  padding-left: 15px;
  > p {
    margin-bottom: 5px;
  }
}
.api {
  padding: 10px 0;
  margin-bottom: 10px;
}
.api-name {
  font-size: 17px;
  font-weight: 600;
  padding: 10px 0;
  border-top: 1px solid rgba(204, 204, 204, 0.3);
  margin-bottom: 10px;
  color: #4fc08d;
}
.api-desc {
  padding: 5px 0;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #555;
  border-left: 5px solid #4fc08d;
  padding-left: 15px;
  > p {
    margin-bottom: 5px;
  }
}
.api-url {
  margin-bottom: 10px;
}
.mark {
  display: inline-block;
  background-color: #eee;
  color: #0080ff;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 10px;
  vertical-align: 10%;
}
.api-method {
  margin-bottom: 15px;
}
.api-params {
  margin-bottom: 15px;
}
.table {
  margin-top: 10px;
  width: 100%;
  color: #34495e;
  font-size: 14px;
  line-height: 1.5;
  border-collapse: collapse;
  th {
    padding: 8px 10px;
    font-weight: 600;
    text-align: left;
    border-top: 1px solid #f1f4f8;
    border-bottom: 1px solid #eee;
    background-color: #fafafa;
  }
  td {
    padding: 8px;
    border-bottom: 1px solid #f1f4f8;
  }
}
</style>

<script>
import app from './service/app'
export default app
</script>