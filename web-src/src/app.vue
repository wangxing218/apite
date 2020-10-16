<template>
  <div class="container">
    <div class="menu-bar">
      <div class="tiny-btn left" @click="showMenu = !showMenu">目录</div>
    </div>
    <div class="side" :class="{show: showMenu}">
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
    <div class="main"  @click="showMenu = false">
      <div class="doc">
        <!-- doc info -->
        <div class="card" v-if="info.title || info.desc">
          <h1 class="doc-title" v-if="info.title">{{ info.title }}</h1>
          <div class="doc-desc" v-if="info.desc" v-html="toHtml(info.desc)"></div>
        </div>

        <!-- file mod -->
        <div class="mod" v-for="item in data" :key="data.file">
          <div class="card">
            <h2 class="mod-title">{{ item.name }}</h2>
            <div class="mod-desc" v-if="item.description" v-html="toHtml(item.description)"></div>
          </div>

          <!-- api item -->
          
          <div
              class="api card"
              v-for="item in item.routes"
              :key="item.method + item.url"
            > <div class="">
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
                      <td>{{ item.required ? '-' : item.default }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="tiny-btn right" @click="item.debug = !item.debug ">在线调试</div>
              <app-request v-if="item.debug" :router="item"></app-request>
            </div>
          </div>
        </div>
      </div>
      <div class="copyright">
        <a href="https://github.com/wangxing218/apite">apite</a>
        <a href="https://github.com/wangxing218/apite#readme">help</a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "./asset/_var";

.container {
  margin-left: auto;
  margin-right: auto;
  position: relative;
  max-width: 1200px;
  height: 100%;
  width: 100%;
}
.side {
  user-select: none;
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  overflow: hidden auto;
  -webkit-overflow-scrolling: touch;
  width: 200px;
  padding: 0 15px 30px;
  z-index: 3;
  background-color: #fff;
  
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
  padding: 15px 15px 30px;
}

.card{
  @include clearfix;
  background-color: #fff;
  border-radius: 4px;
  margin-bottom: 15px;
  padding: 0 15px;
}
.doc{
  min-height: 90vh;
}
.copyright {
  text-align: center;
  padding: 10px 0;
  font-size: 12px;
  color: #999;
  > a{
    color: #999;
    text-decoration: none;
    opacity: .6;
    margin: 0 10px;
    &:hover{
      color: #0080ff;
      text-decoration: underline;
      opacity: 1;
    }
  }
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
  > p {
    margin-bottom: 5px;
  }
}
.api {
  padding: 5px 15px 15px;
}
.api-name {
  font-size: 17px;
  font-weight: 600;
  padding: 10px 0;
  color: #4fc08d;
}
.api-desc {
  padding: 5px 0;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 22px;
  color: #555;
  border-left: 5px solid #eee;
  padding-left: 15px;
  > p {
    margin-bottom: 5px;
  }
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
  vertical-align: 5%;
}
.api-method, .api-url {
  margin-bottom: 15px;
  font-size: 14px;
}
.api-params {
  margin-bottom: 15px;
  position: relative;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
}
.table {
  margin-top: 10px;
  width: 100%;
  min-width: 500px;
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

.menu-bar{
  position: absolute;
  height: 44px;
  top: 10px;
  right: 10px;
  display: none;
}
@media screen and (max-width: 680px) {
  .menu-bar{
    display: block;
  }
  .side {
    display: none;
    box-shadow: 6px 0 5px #eee;
    &.show{
      display: block;
      left: 0;
    }
  }
  .main {
    margin-left: 0;
    padding: 15px 0 30px;
  }
  .card{
    border-radius: 0;
  }
}
</style>

<script>
import app from './service/app'
export default app
</script>