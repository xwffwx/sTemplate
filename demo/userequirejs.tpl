<ul style='list-style-type:none;'>
  for (var k in st) {
    <li>
      <div>
        <span>{{ k }}=</span>
        if ('object' == typeof st[k]) {
          {{ sTemplate.build.template_rtest(st[k]) }}
        } else {
          <span>{{ st[k] }}</span>
        }
      </div>
    </li>
  }
</ul>
